import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler, HttpError } from '../middleware/asyncHandler';
import { FileService } from '../services/File.service';
import { parseParamId } from '../utils/parsParamId';

const fileService = new FileService();

export class FileController {
    findAll = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { search, page, limit } = req.query;
        const filters: any = {};
        if (search) filters.search = search as string;
        const pagination = {
            page: parseInt(page as string) || 1,
            limit: Math.min(parseInt(limit as string) || 20, 100),
        };
        res.json(await fileService.findAll(req.userId!, filters, pagination));
    });

    upload = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.file) throw new HttpError(400, 'No file provided');

        const file = await fileService.create(req.userId!, {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`,
        });

        res.status(201).json({ file });
    });

    updateOne = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = parseParamId(req.params.id)!;
        try {
            const file = await fileService.update(id, req.userId!, req.body);
            res.json({ file });
        } catch (e: any) {
            throw e.message === 'File not found' ? new HttpError(404, e.message) : e;
        }
    });

    deleteOne = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = parseParamId(req.params.id)!;
        try {
            res.json(await fileService.delete(id, req.userId!));
        } catch (e: any) {
            throw e.message === 'File not found' ? new HttpError(404, e.message) : e;
        }
    });
}
