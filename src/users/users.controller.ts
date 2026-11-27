import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery
} from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Получить список пользователей с пагинацией' })
    @ApiResponse({ status: 200, description: 'Список пользователей получен' })
    @ApiQuery({ name: 'page', required: false, description: 'Номер страницы (по умолчанию 1)' })
    @ApiQuery({ name: 'limit', required: false, description: 'Записей на странице (по умолчанию 10)' })
    @ApiQuery({ name: 'filterName', required: false, description: 'Фильтр по имени' })
    @Get()
    findAllPaginated(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('filterName') filterName?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.usersService.findAllPaginated(pageNum, limitNum, filterName);
    }

    @ApiOperation({ summary: 'Получить пользователя по id' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @ApiOperation({ summary: 'Создать пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @ApiOperation({ summary: 'Обновить пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно обновлён' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(+id, dto);
    }

    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно удалён' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @ApiOperation({ summary: 'проблема N+1 (до)' })
    @ApiResponse({ status: 200, description: 'Список пользователей с задачами (N+1)' })
    @Get('/n-plus-one')
    findAllWithNPlusOne() {
        return this.usersService.findAllWithNPlusOneProblem();
    }

    @ApiOperation({ summary: 'оптимизированный запрос (после)' })
    @ApiResponse({ status: 200, description: 'Список пользователей с задачами (1 запрос)' })
    @Get('/optimized')
    findAllOptimized() {
        return this.usersService.findAllOptimized();
    }
}