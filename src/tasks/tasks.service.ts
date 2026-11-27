import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

export class Task {
    id: string;
    name: string;
    description: string;
}

@Injectable()
export class TasksService {
    private tasks = [{ id: '1', name: 'Task 1', description: 'Description 1' }, { id: '2', name: 'Task 2', description: 'Description 2' },];

    getAllTasks(filterName: string) {
        if (!filterName) return this.tasks;
        return this.tasks.filter(task => task.name.includes(filterName));
    }

    getTaskById(id: string) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new NotFoundException(`Задача с id ${id} не найдена`);
        }
        return task;
    }

    createTask(dto: CreateTaskDto) {
        const task = { id: Date.now().toString(), name: dto.name, description: dto.description };
        this.tasks.push(task);
        return task;
    }

    updateTask(id: string, dto: UpdateTaskDto) {
        const task = this.getTaskById(id);
        if (!dto.name) task.name = dto.name!;
        if (!dto.description) task.description = dto.description!;
        return task;
    }

    deleteTask(id: string) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}