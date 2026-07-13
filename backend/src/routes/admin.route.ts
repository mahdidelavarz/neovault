import { Router } from 'express';
import { AdminController } from '../controllers/Admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware);
router.use(adminMiddleware);
router.get('/overview', adminController.getOverview);
router.patch('/users/:id/admin', adminController.makeUserAdmin);

export default router;
