import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { asyncHandler } from './asyncHandler';

export const ADMIN_EMAIL = 'mdelever77@gmail.com';

export const adminMiddleware = asyncHandler(async (req, res, next) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.userId } });

    if (!user || (!user.isAdmin && user.email !== ADMIN_EMAIL)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
});
