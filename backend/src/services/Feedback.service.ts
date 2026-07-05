import { AppDataSource } from '../config/database';
import { Feedback, FeedbackType } from '../entities/Feedback';

export class FeedbackService {
    private feedbackRepository = AppDataSource.getRepository(Feedback);

    async create(userId: number, data: { type: FeedbackType; message: string }) {
        const feedback = new Feedback();
        feedback.type = data.type;
        feedback.message = data.message;
        feedback.userId = userId;

        return await this.feedbackRepository.save(feedback);
    }

    async findAllForAdmin() {
        return await this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoin('feedback.user', 'user')
            .addSelect(['user.id', 'user.username', 'user.email'])
            .orderBy('feedback.createdAt', 'DESC')
            .getMany();
    }
}
