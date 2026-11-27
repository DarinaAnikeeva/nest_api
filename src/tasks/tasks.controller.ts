import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/role.enum.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Задачи')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @ApiOperation({ summary: 'Получить список задач' })
    @ApiResponse({ status: 200, description: 'Список задач успешно получен' })
    @Get()
    getAllTasks(@Query('filterName') filterName: string) {
        return this.tasksService.getAllTasks(filterName);
    }

    @ApiOperation({ summary: 'Получить задачу по id' })
    @ApiResponse({ status: 200, description: 'Задача успешно получена' })
    @Get(':id')
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(id);
    }

    @ApiOperation({ summary: 'Создать задачу' })
    @ApiResponse({ status: 201, description: 'Задача успешно создана' })
    @Post()
    createTask(@Body() dto: CreateTaskDto) {
        return this.tasksService.createTask(dto);
    }

    @ApiOperation({ summary: 'Обновить задачу' })
    @ApiResponse({ status: 200, description: 'Задача успешно обновлена' })
    @Patch(':id')
    updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.updateTask(id, dto);
    }

    @ApiOperation({ summary: 'Удалить задачу' })
    @ApiResponse({ status: 200, description: 'Задача успешно удалена' })
    @Delete(':id')
    @Roles(Role.Admin)
    deleteTask(@Param('id') id: string) {
        return this.tasksService.deleteTask(id);
    }
}