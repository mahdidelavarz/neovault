import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from './auth.middleware';
import { jwtConfig } from '../config/jwt';
import { ActivityEventType } from '../entities/ActivityEvent';
import { ActivityService } from '../services/Activity.service';

const activityService = new ActivityService();

const TRACKED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const IGNORED_PREFIXES = ['/api/auth/refresh', '/api/admin', '/api/activity'];

function userIdFromRequest(req: AuthRequest): number | undefined {
    if (req.userId) return req.userId;

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!token) return undefined;

    try {
        const decoded = jwt.verify(token, jwtConfig.secret) as { userId?: number };
        return decoded.userId;
    } catch {
        return undefined;
    }
}

function classify(req: AuthRequest): { type: ActivityEventType; module: string; action: string; resourceType?: string; resourceId?: string } {
    const path = req.path;
    const parts = path.split('/').filter(Boolean);
    const module = parts[0] ?? 'app';
    const resourceId = parts.find((part) => /^\d+$/.test(part));

    if (req.method === 'POST') {
        if (path.endsWith('/test')) return { type: 'api_test', module, action: 'Tested API endpoint', resourceType: module, resourceId };
        return { type: 'create', module, action: `Created ${module}`, resourceType: module, resourceId };
    }

    if (req.method === 'PUT') return { type: 'update', module, action: `Updated ${module}`, resourceType: module, resourceId };
    if (req.method === 'DELETE') return { type: 'delete', module, action: `Deleted ${module}`, resourceType: module, resourceId };

    if (req.method === 'PATCH') {
        const subAction = parts[parts.length - 1];
        if (subAction === 'favorite' || subAction === 'pin') {
            return { type: 'favorite', module, action: `Changed ${module} favorite state`, resourceType: module, resourceId };
        }
        if (subAction === 'use') return { type: 'use', module, action: `Used ${module}`, resourceType: module, resourceId };
        return { type: 'update', module, action: `Updated ${module}`, resourceType: module, resourceId };
    }

    return { type: 'other', module, action: `${req.method} ${module}`, resourceType: module, resourceId };
}

export const activityMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!TRACKED_METHODS.has(req.method) || IGNORED_PREFIXES.some((prefix) => req.originalUrl.startsWith(prefix))) {
        return next();
    }

    res.on('finish', () => {
        if (res.statusCode >= 400) return;

        const userId = userIdFromRequest(req);
        if (!userId) return;

        const event = classify(req);
        activityService.log({
            userId,
            ...event,
            method: req.method,
            path: req.originalUrl,
            userAgent: req.get('user-agent'),
            ipAddress: req.ip,
        }).catch((error) => {
            console.error('Activity log failed:', error);
        });
    });

    return next();
};
