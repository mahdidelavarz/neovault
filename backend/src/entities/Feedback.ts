import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';

export type FeedbackType = 'bug' | 'feature' | 'comment';

@Entity('feedback')
@Index(['createdAt'])
export class Feedback {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 20 })
    type!: FeedbackType;

    @Column({ type: 'text' })
    message!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Index()
    @Column({ type: 'int', name: 'user_id' })
    userId!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
