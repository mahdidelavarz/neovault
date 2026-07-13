import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { ActivityService } from '../services/Activity.service';

const router = Router();
const activityService = new ActivityService();

router.use(authMiddleware);

router.post('/app-open', asyncHandler(async (req: AuthRequest, res) => {
    if (!req.userId) return res.status(401).json({ message: 'No user' });

    await activityService.log({
        userId: req.userId,
        type: 'app_open',
        module: 'app',
        action: 'Opened the app',
        method: 'POST',
        path: req.originalUrl,
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
    });

    res.status(204).send();
}));

export default router;
