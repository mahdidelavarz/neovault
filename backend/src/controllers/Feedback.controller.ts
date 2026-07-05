import { Response } from 'express';
import { FeedbackService } from '../services/Feedback.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';

const feedbackService = new FeedbackService();

export class FeedbackController {
    create = asyncHandler(async (req: AuthRequest, res: Response) => {
        const feedback = await feedbackService.create(req.userId!, req.body);
        res.status(201).json({ feedback });
    });

    listForAdmin = asyncHandler(async (_req: AuthRequest, res: Response) => {
        const feedback = await feedbackService.findAllForAdmin();
        res.json({ feedback });
    });
}
