import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from './User';

@Entity('files')
@Index(['userId', 'createdAt'])
export class UploadedFile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    filename!: string;

    @Column({ type: 'varchar', length: 255, name: 'original_name' })
    originalName!: string;

    @Column({ type: 'varchar', length: 100 })
    mimetype!: string;

    @Column({ type: 'int' })
    size!: number;

    @Column({ type: 'varchar', length: 500 })
    path!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @ManyToOne(() => User)
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
