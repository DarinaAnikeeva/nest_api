import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({ example: 'Сходить в магазин', description: 'Название задачи' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Сходить в магазин и купить продукты на ужин для семьи', description: 'Описание задачи' })
    @IsString()
    description: string;
}