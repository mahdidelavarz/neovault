import { Router } from 'express';
import { FileController } from '../controllers/File.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate';
import { updateFileSchema } from '../validation/schemas';

const router = Router();
const fileController = new FileController();

router.use(authMiddleware);

router.get('/', fileController.findAll);
router.post('/', upload.single('file'), fileController.upload);
router.patch('/:id', validate(updateFileSchema), fileController.updateOne);
router.delete('/:id', fileController.deleteOne);

export default router;
