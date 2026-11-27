import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entity/task.entity.js';
import { Role } from '../../auth/role.enum.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[]
}