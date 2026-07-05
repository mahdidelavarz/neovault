import { AppDataSource } from '../config/database';
import { ApiEndpoint } from '../entities/ApiEndpoint';
import { ApiCollection } from '../entities/ApiCollection';
import { ApiEnvironment } from '../entities/ApiEnvironment';
import { Taggable } from '../entities/Taggable';
import { encrypt, decrypt } from '../utils/crypto';
import { validateRequestUrl, isPrivateHostname } from '../utils/ssrf.util';
import axios from 'axios';

/** Cap the proxied response so a huge/malicious target can't exhaust server memory. */
const MAX_RESPONSE_BYTES = 10 * 1024 * 1024; // 10 MB

/** How long the outbound request may take before we abort it. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Tag an error as a client (4xx) error so the global handler responds with `status`. */
function clientError(message: string, status = 400): Error {
    const err = new Error(message) as Error & { status: number };
    err.status = status;
    return err;
}

export class ApiService {
    private endpointRepository = AppDataSource.getRepository(ApiEndpoint);
    private collectionRepository = AppDataSource.getRepository(ApiCollection);
    private environmentRepository = AppDataSource.getRepository(ApiEnvironment);
    private taggableRepository = AppDataSource.getRepository(Taggable);

    // ─── Collections ────────────────────────────────────────────────────────────

    async getCollections(userId: number) {
        const collections = await this.collectionRepository.find({
            where: { userId },
            order: { name: 'ASC' },
        });

        const collectionsWithCount = await Promise.all(
            collections.map(async (col) => {
                const count = await this.endpointRepository.count({
                    where: { collectionId: col.id, userId },
                });
                return { ...col, _count: { endpoints: count } };
            })
        );

        return collectionsWithCount;
    }

    async createCollection(userId: number, data: { name: string; description?: string }) {
        const collection = new ApiCollection();
        collection.name = data.name;
        collection.description = data.description || '';
        collection.userId = userId;
        return await this.collectionRepository.save(collection);
    }

    async deleteCollection(id: number, userId: number) {
        const collection = await this.collectionRepository.findOne({ where: { id, userId } });
        if (!collection) throw new Error('Collection not found');

        // Must use QueryBuilder — repository.update() silently ignores undefined/null values
        await this.endpointRepository
            .createQueryBuilder()
            .update()
            .set({ collectionId: null as any })
            .where('collectionId = :id AND userId = :userId', { id, userId })
            .execute();

        await this.collectionRepository.remove(collection);
        return { message: 'Collection deleted' };
    }

    // ─── Environments ────────────────────────────────────────────────────────────

    async getEnvironments(userId: number) {
        return this.environmentRepository.find({
            where: { userId },
            order: { name: 'ASC' },
        });
    }

    async createEnvironment(userId: number, data: { name: string; variables?: { key: string; value: string; enabled: boolean }[] }) {
        const env = new ApiEnvironment();
        env.name = data.name;
        env.variables = data.variables ?? [];
        env.userId = userId;
        return this.environmentRepository.save(env);
    }

    async updateEnvironment(id: number, userId: number, data: { name?: string; variables?: { key: string; value: string; enabled: boolean }[] }) {
        const env = await this.environmentRepository.findOne({ where: { id, userId } });
        if (!env) throw new Error('Environment not found');
        if (data.name !== undefined) env.name = data.name;
        if (data.variables !== undefined) env.variables = data.variables;
        return this.environmentRepository.save(env);
    }

    async deleteEnvironment(id: number, userId: number) {
        const env = await this.environmentRepository.findOne({ where: { id, userId } });
        if (!env) throw new Error('Environment not found');
        await this.environmentRepository.remove(env);
        return { message: 'Environment deleted' };
    }

    // ─── Endpoints ──────────────────────────────────────────────────────────────

    async getEndpoints(userId: number, filters?: {
        collectionId?: number;
        categoryId?: number;
        search?: string;
        method?: string;
        isFavorite?: boolean;
    }) {
        const qb = this.endpointRepository.createQueryBuilder('endpoint')
            .leftJoinAndSelect('endpoint.collection', 'collection')
            .leftJoinAndSelect('endpoint.category', 'category')
            .where('endpoint.userId = :userId', { userId });

        if (filters?.collectionId)
            qb.andWhere('endpoint.collectionId = :collectionId', { collectionId: filters.collectionId });
        if (filters?.categoryId)
            qb.andWhere('endpoint.categoryId = :categoryId', { categoryId: filters.categoryId });
        if (filters?.search)
            qb.andWhere('(endpoint.title LIKE :search OR endpoint.url LIKE :search)',
                { search: `%${filters.search}%` });
        if (filters?.method)
            qb.andWhere('endpoint.method = :method', { method: filters.method });
        if (filters?.isFavorite)
            qb.andWhere('endpoint.isFavorite = :isFavorite', { isFavorite: filters.isFavorite });

        const endpoints = await qb.orderBy('endpoint.updatedAt', 'DESC').take(200).getMany();

        const withTags = await this.loadTags(endpoints);
        // P0-3: decrypt authData for each endpoint before returning to client
        return withTags.map(ep => this.withDecryptedAuth(ep));
    }

    async getEndpoint(id: number, userId: number) {
        const endpoint = await this.endpointRepository.findOne({
            where: { id, userId },
            relations: ['collection', 'category'],
        });
        if (!endpoint) throw new Error('Endpoint not found');
        const withTags = await this.loadTags([endpoint]);
        // P0-3: decrypt authData before returning to client
        return this.withDecryptedAuth(withTags[0]);
    }

    async createEndpoint(userId: number, data: any) {
        const endpoint = new ApiEndpoint();
        Object.assign(endpoint, {
            ...data,
            userId,
            authType: data.authType || 'none',
            isFavorite: data.isFavorite || false,
            // P0-3: encrypt authData before persisting
            authData: data.authData ? this.encryptAuthData(data.authData) : undefined,
        });

        const saved = await this.endpointRepository.save(endpoint);
        if (data.tagIds?.length) await this.syncTags(saved.id, data.tagIds);
        return await this.getEndpoint(saved.id, userId);
    }

    async updateEndpoint(id: number, userId: number, data: any) {
        const endpoint = await this.endpointRepository.findOne({ where: { id, userId } });
        if (!endpoint) throw new Error('Endpoint not found');

        // P0-3: encrypt authData only when a new value is provided
        const payload = { ...data };
        if (data.authData !== undefined) {
            payload.authData = this.encryptAuthData(data.authData);
        }

        Object.assign(endpoint, payload);
        await this.endpointRepository.save(endpoint);

        if (data.tagIds) await this.syncTags(id, data.tagIds);
        return await this.getEndpoint(id, userId);
    }

    async deleteEndpoint(id: number, userId: number) {
        const endpoint = await this.endpointRepository.findOne({ where: { id, userId } });
        if (!endpoint) throw new Error('Endpoint not found');

        await this.taggableRepository.delete({ taggableId: id, taggableType: 'api_endpoint' });
        await this.endpointRepository.remove(endpoint);
        return { message: 'Endpoint deleted' };
    }

    // ─── Test endpoint ───────────────────────────────────────────────────────────

    async testEndpoint(userId: number, data: {
        method: string;
        url: string;
        headers?: Record<string, string>;
        body?: string;
        bodyType?: string;
        authType?: string;
        authData?: any;
    }) {
        const method = (data.method || 'GET').toUpperCase();

        // Parse the JSON body up front so a syntax error is a clean 400, not a 500.
        let requestData: any;
        if (data.body && method !== 'GET' && method !== 'HEAD') {
            if (data.bodyType === 'json') {
                try {
                    requestData = JSON.parse(data.body);
                } catch {
                    throw clientError('Request body is not valid JSON.');
                }
            } else {
                requestData = data.body;
            }
        }

        // P0-1: Block SSRF — validate URL before making any outbound request.
        // Validation failures are the caller's fault (bad/blocked URL) → 400, not 500.
        try {
            await validateRequestUrl(data.url);
        } catch (err: any) {
            throw clientError(err?.message || 'Invalid request URL.');
        }

        const startTime = Date.now();

        try {
            // P0-2: Build auth headers from authType / authData when present
            const authHeaders = this.buildAuthHeaders(data.authType, data.authData);

            const config: any = {
                method: method.toLowerCase(),
                url: data.url,
                // Send browser-like defaults first. Many WAF-protected hosts silently
                // stall (→ timeout) on the default "axios/x.y" User-Agent even though
                // the same request succeeds from Postman/a browser. Auth headers, then
                // the caller's explicit headers, override these defaults.
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    ...authHeaders,
                    ...(data.headers ?? {}),
                },
                validateStatus: () => true,
                timeout: REQUEST_TIMEOUT_MS,
                maxContentLength: MAX_RESPONSE_BYTES,
                maxBodyLength: MAX_RESPONSE_BYTES,
                // Re-check every redirect hop: a public URL can 3xx to an internal
                // address. beforeRedirect is synchronous, so we use the literal-IP guard.
                beforeRedirect: (options: any) => {
                    if (isPrivateHostname(options.hostname || options.host || '')) {
                        throw clientError('Redirect to a private or internal address was blocked.');
                    }
                },
            };

            if (requestData !== undefined) config.data = requestData;

            const response = await axios(config);
            const elapsed = Date.now() - startTime;

            const responseBody = typeof response.data === 'object'
                ? JSON.stringify(response.data, null, 2)
                : String(response.data);

            return {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers as Record<string, string>,
                body: responseBody,
                time: elapsed,
                size: Buffer.byteLength(responseBody, 'utf8'),
            };
        } catch (error: any) {
            const elapsed = Date.now() - startTime;

            // The target responded, just with an error status axios rejected on.
            if (error.response) {
                const body = typeof error.response.data === 'object'
                    ? JSON.stringify(error.response.data, null, 2)
                    : String(error.response.data ?? '');
                return {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers as Record<string, string>,
                    body,
                    time: elapsed,
                    size: Buffer.byteLength(body, 'utf8'),
                };
            }

            // A blocked redirect is a client error → surface it as 400.
            if ((error as any).status) throw error;

            // No response: DNS failure, connection refused, timeout, size cap, etc.
            // This is about the *target* the user typed, not our server — return a
            // Postman-style 0-status result rather than a misleading 500.
            const reason = error.code === 'ECONNABORTED'
                ? `Request to target timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
                : (error.message || 'Could not connect to the target server');
            return {
                status: 0,
                statusText: error.code || 'Network Error',
                headers: {},
                body: JSON.stringify({ error: reason }, null, 2),
                time: elapsed,
                size: 0,
            };
        }
    }

    // ─── Private helpers ─────────────────────────────────────────────────────────

    /**
     * P0-2: Translate saved auth configuration into HTTP headers.
     */
    private buildAuthHeaders(authType?: string, authData?: any): Record<string, string> {
        if (!authType || authType === 'none' || !authData) return {};

        switch (authType) {
            case 'bearer': {
                const token = authData.token ?? authData.value;
                if (token) return { Authorization: `Bearer ${token}` };
                break;
            }
            case 'basic': {
                const { username, password } = authData;
                if (username && password) {
                    const encoded = Buffer.from(`${username}:${password}`).toString('base64');
                    return { Authorization: `Basic ${encoded}` };
                }
                break;
            }
            case 'api-key': {
                const key = authData.key ?? authData.value;
                if (key) {
                    // Default to header injection; query param injection handled client-side
                    const headerName = authData.headerName ?? 'X-API-Key';
                    return { [headerName]: key };
                }
                break;
            }
        }
        return {};
    }

    /**
     * P0-3: Wrap a plaintext authData object in an encrypted envelope.
     * Safe to call even when ENCRYPTION_KEY is not set — falls back to plaintext.
     */
    private encryptAuthData(authData: any): any {
        if (!authData) return authData;
        if (!process.env.ENCRYPTION_KEY) return authData; // no-op when key not configured
        // Already encrypted — don't double-encrypt
        if (authData?.__enc) return authData;
        try {
            return { __enc: encrypt(JSON.stringify(authData)) };
        } catch {
            return authData;
        }
    }

    /**
     * P0-3: Unwrap an encrypted authData envelope back to the original object.
     * Returns plaintext authData unchanged if it was never encrypted.
     */
    private decryptAuthData(authData: any): any {
        if (!authData?.__enc) return authData;
        try {
            return JSON.parse(decrypt(authData.__enc));
        } catch {
            return authData;
        }
    }

    /** Apply decrypted authData to an endpoint DTO. */
    private withDecryptedAuth(ep: any): any {
        if (!ep) return ep;
        return { ...ep, authData: this.decryptAuthData(ep.authData) };
    }

    private async syncTags(endpointId: number, tagIds: number[]) {
        await this.taggableRepository.delete({ taggableId: endpointId, taggableType: 'api_endpoint' });
        if (tagIds.length > 0) {
            const taggables = tagIds.map(tagId => {
                const t = new Taggable();
                t.tagId = tagId;
                t.taggableId = endpointId;
                t.taggableType = 'api_endpoint';
                return t;
            });
            await this.taggableRepository.save(taggables);
        }
    }

    private async loadTags(endpoints: ApiEndpoint[]): Promise<any[]> {
        const result = [];
        for (const ep of endpoints) {
            const taggables = await this.taggableRepository.find({
                where: { taggableId: ep.id, taggableType: 'api_endpoint' },
                relations: ['tag'],
            });
            result.push({ ...ep, tags: taggables.map(t => t.tag) });
        }
        return result;
    }
}
