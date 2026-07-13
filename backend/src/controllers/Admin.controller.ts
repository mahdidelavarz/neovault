import { Response } from 'express';
import { AdminService } from '../services/Admin.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';

const adminService = new AdminService();

export class AdminController {
    getOverview = asyncHandler(async (_req: AuthRequest, res: Response) => {
        const overview = await adminService.getOverview();
        res.json(overview);
    });

    makeUserAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await adminService.makeUserAdmin(userId);
        res.json({ message: 'User promoted to admin', user });
    });
}
