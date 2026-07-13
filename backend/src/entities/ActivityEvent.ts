import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';

export type ActivityEventType = 'app_open' | 'login' | 'create' | 'update' | 'delete' | 'favorite' | 'use' | 'api_test' | 'other';

@Entity('activity_events')
@Index('idx_activity_events_user_created', ['userId', 'createdAt'])
@Index('idx_activity_events_type_created', ['type', 'createdAt'])
export class ActivityEvent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 40 })
    type!: ActivityEventType;

    @Column({ type: 'varchar', length: 60 })
    module!: string;

    @Column({ type: 'varchar', length: 120 })
    action!: string;

    @Column({ type: 'varchar', length: 30 })
    method!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    path?: string;

    @Column({ type: 'varchar', length: 80, name: 'resource_type', nullable: true })
    resourceType?: string;

    @Column({ type: 'varchar', length: 80, name: 'resource_id', nullable: true })
    resourceId?: string;

    @Column({ type: 'varchar', length: 255, name: 'user_agent', nullable: true })
    userAgent?: string;

    @Column({ type: 'varchar', length: 80, name: 'ip_address', nullable: true })
    ipAddress?: string;

    @Column({ name: 'user_id' })
    userId!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
