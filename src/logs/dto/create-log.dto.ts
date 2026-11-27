import { IsNotEmpty, IsString, IsOptional, IsObject, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogDto {
    @ApiProperty({ example: '1', description: 'ID пользователя из Postgres' })
    @IsInt()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'login', description: 'Тип действия' })
    @IsString()
    @IsNotEmpty()
    action: string;

    @ApiPropertyOptional({
        example: { ip: '127.0.0.1', device: 'Chrome' },
        description: 'Дополнительные метаданные события',
    })
    @IsOptional()
    @IsObject()
    meta?: Record<string, any>;
}