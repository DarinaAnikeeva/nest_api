import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entity/user.entity.js';
import { Task } from './tasks/entity/task.entity.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'secret',
    database: 'mydb',
    entities: [User, Task],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});