import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Link } from './Link';
import { Note } from './Note';
import { Category } from './Category';
import { Tag } from './Tag';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, unique: true , nullable: true })
    username!: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    email?: string;

    @Column({ type: 'varchar', length: 255, name: 'password_hash' })
    passwordHash!: string;

    @Column({ type: 'boolean', name: 'is_admin', default: false })
    isAdmin!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() => Link, link => link.user)
    links!: Link[];

    @OneToMany(() => Note, note => note.user)
    notes!: Note[];

    @OneToMany(() => Category, category => category.user)
    categories!: Category[];

    @OneToMany(() => Tag, tag => tag.user)
    tags!: Tag[];
}
