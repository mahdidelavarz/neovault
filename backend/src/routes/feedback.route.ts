import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { FeedbackController } from '../controllers/Feedback.controller';
import { validate } from '../middleware/validate';
import { createFeedbackSchema } from '../validation/schemas';

const router = Router();
const feedbackController = new FeedbackController();

router.use(authMiddleware);

router.post('/', validate(createFeedbackSchema), feedbackController.create);

// Admin-only: read all submitted feedback
router.get('/admin', adminMiddleware, feedbackController.listForAdmin);

export default router;
