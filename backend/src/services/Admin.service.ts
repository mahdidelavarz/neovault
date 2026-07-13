import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Link } from '../entities/Link';
import { Note } from '../entities/Note';
import { Snippet } from '../entities/Snippet';
import { Prompt } from '../entities/Prompt';
import { ApiCollection } from '../entities/ApiCollection';
import { Infrastructure } from '../entities/Infrastructure';
import { Project } from '../entities/Project';
import { ActivityEvent } from '../entities/ActivityEvent';

export class AdminService {
    private userRepository = AppDataSource.getRepository(User);
    private linkRepository = AppDataSource.getRepository(Link);
    private noteRepository = AppDataSource.getRepository(Note);
    private snippetRepository = AppDataSource.getRepository(Snippet);
    private promptRepository = AppDataSource.getRepository(Prompt);
    private apiCollectionRepository = AppDataSource.getRepository(ApiCollection);
    private infrastructureRepository = AppDataSource.getRepository(Infrastructure);
    private projectRepository = AppDataSource.getRepository(Project);
    private activityRepository = AppDataSource.getRepository(ActivityEvent);

    private async countsByUser(repository: { createQueryBuilder: Function }, alias: string): Promise<Map<number, number>> {
        const rows = await (repository as any)
            .createQueryBuilder(alias)
            .select(`${alias}.userId`, 'userId')
            .addSelect('COUNT(*)', 'count')
            .groupBy(`${alias}.userId`)
            .getRawMany();

        return new Map(rows.map((row: any) => [Number(row.userId), Number(row.count)]));
    }

    async getOverview() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [
            totalUsers,
            users,
            linkCounts,
            noteCounts,
            snippetCounts,
            promptCounts,
            apiCollectionCounts,
            infrastructureCounts,
            projectCounts,
            totalEvents,
            eventsToday,
            appOpensToday,
            loginsToday,
            appOpenCounts,
            loginCounts,
            actionCounts,
            lastLoginRows,
            lastSeenRows,
            recentActivity,
        ] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.find({ order: { createdAt: 'ASC' } }),
            this.countsByUser(this.linkRepository, 'link'),
            this.countsByUser(this.noteRepository, 'note'),
            this.countsByUser(this.snippetRepository, 'snippet'),
            this.countsByUser(this.promptRepository, 'prompt'),
            this.countsByUser(this.apiCollectionRepository, 'apiCollection'),
            this.countsByUser(this.infrastructureRepository, 'infrastructure'),
            this.countsByUser(this.projectRepository, 'project'),
            this.activityRepository.count(),
            this.activityRepository
                .createQueryBuilder('activity')
                .where('activity.createdAt >= :startOfToday', { startOfToday })
                .getCount(),
            this.activityRepository
                .createQueryBuilder('activity')
                .where('activity.type = :type', { type: 'app_open' })
                .andWhere('activity.createdAt >= :startOfToday', { startOfToday })
                .getCount(),
            this.activityRepository
                .createQueryBuilder('activity')
                .where('activity.type = :type', { type: 'login' })
                .andWhere('activity.createdAt >= :startOfToday', { startOfToday })
                .getCount(),
            this.activityCountsByUser('app_open'),
            this.activityCountsByUser('login'),
            this.activityCountsByUser(),
            this.lastActivityByUser('login'),
            this.lastActivityByUser(),
            this.activityRepository.find({
                order: { createdAt: 'DESC' },
                take: 60,
                relations: ['user'],
            }),
        ]);

        const lastLoginByUser = new Map(lastLoginRows.map((row: any) => [Number(row.userId), row.lastAt]));
        const lastSeenByUser = new Map(lastSeenRows.map((row: any) => [Number(row.userId), row.lastAt]));

        return {
            totalUsers,
            totalEvents,
            eventsToday,
            appOpensToday,
            loginsToday,
            users: users.map((user) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin || user.email === 'mdelever77@gmail.com',
                createdAt: user.createdAt,
                appOpenCount: appOpenCounts.get(user.id) ?? 0,
                loginCount: loginCounts.get(user.id) ?? 0,
                actionCount: actionCounts.get(user.id) ?? 0,
                lastLoginAt: lastLoginByUser.get(user.id) ?? null,
                lastSeenAt: lastSeenByUser.get(user.id) ?? null,
                linksCount: linkCounts.get(user.id) ?? 0,
                notesCount: noteCounts.get(user.id) ?? 0,
                snippetsCount: snippetCounts.get(user.id) ?? 0,
                promptsCount: promptCounts.get(user.id) ?? 0,
                apiCollectionsCount: apiCollectionCounts.get(user.id) ?? 0,
                infrastructureCount: infrastructureCounts.get(user.id) ?? 0,
                projectsCount: projectCounts.get(user.id) ?? 0,
            })),
            recentActivity: recentActivity.map((event) => ({
                id: event.id,
                type: event.type,
                module: event.module,
                action: event.action,
                method: event.method,
                path: event.path,
                resourceType: event.resourceType,
                resourceId: event.resourceId,
                createdAt: event.createdAt,
                user: {
                    id: event.user.id,
                    username: event.user.username,
                    email: event.user.email,
                },
            })),
        };
    }

    async makeUserAdmin(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        user.isAdmin = true;
        await this.userRepository.save(user);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        };
    }

    private async activityCountsByUser(type?: string): Promise<Map<number, number>> {
        const qb = this.activityRepository
            .createQueryBuilder('activity')
            .select('activity.userId', 'userId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('activity.userId');

        if (type) qb.where('activity.type = :type', { type });

        const rows = await qb.getRawMany();
        return new Map(rows.map((row: any) => [Number(row.userId), Number(row.count)]));
    }

    private async lastActivityByUser(type?: string): Promise<Array<{ userId: number; lastAt: Date }>> {
        const qb = this.activityRepository
            .createQueryBuilder('activity')
            .select('activity.userId', 'userId')
            .addSelect('MAX(activity.createdAt)', 'lastAt')
            .groupBy('activity.userId');

        if (type) qb.where('activity.type = :type', { type });

        return qb.getRawMany();
    }
}
