import { AppDataSource } from '../config/database';
import { ActivityEvent, ActivityEventType } from '../entities/ActivityEvent';

export interface ActivityLogInput {
    userId: number;
    type: ActivityEventType;
    module: string;
    action: string;
    method?: string;
    path?: string;
    resourceType?: string;
    resourceId?: string;
    userAgent?: string;
    ipAddress?: string;
}

export class ActivityService {
    private activityRepository = AppDataSource.getRepository(ActivityEvent);

    async log(input: ActivityLogInput): Promise<void> {
        const event = this.activityRepository.create({
            ...input,
            method: input.method ?? 'SYSTEM',
            userAgent: input.userAgent?.slice(0, 255),
            ipAddress: input.ipAddress?.slice(0, 80),
        });

        await this.activityRepository.save(event);
    }
}
