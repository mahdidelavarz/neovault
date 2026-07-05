import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../config/database';
import { UploadedFile } from '../entities/File';

export class FileService {
    private repo = AppDataSource.getRepository(UploadedFile);

    async findAll(
        userId: number,
        filters?: { search?: string },
        pagination = { page: 1, limit: 20 },
    ) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const qb = this.repo.createQueryBuilder('file')
            .where('file.userId = :userId', { userId });

        if (filters?.search) {
            qb.andWhere('file.originalName LIKE :search', { search: `%${filters.search}%` });
        }

        const [items, total] = await qb
            .orderBy('file.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return { items, total, page, limit, hasMore: skip + items.length < total };
    }

    async findOne(id: number, userId: number) {
        return this.repo.findOne({ where: { id, userId } });
    }

    async create(userId: number, fileData: {
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        path: string;
    }) {
        const file = this.repo.create({ ...fileData, userId });
        return this.repo.save(file);
    }

    async update(id: number, userId: number, data: { description?: string }) {
        const file = await this.repo.findOne({ where: { id, userId } });
        if (!file) throw new Error('File not found');

        if (data.description !== undefined) file.description = data.description;
        return this.repo.save(file);
    }

    async delete(id: number, userId: number) {
        const file = await this.repo.findOne({ where: { id, userId } });
        if (!file) throw new Error('File not found');

        const diskPath = path.join(process.cwd(), 'uploads', file.filename);
        try { fs.unlinkSync(diskPath); } catch { /* file already gone */ }

        await this.repo.remove(file);
        return { message: 'File deleted successfully' };
    }
}
