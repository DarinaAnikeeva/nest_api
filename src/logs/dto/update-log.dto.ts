import { IsString, IsOptional, IsObject, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLogDto {
    @ApiProperty({ example: '1' })
    @IsInt()
    @IsNotEmpty()
    userId: string;

    @ApiPropertyOptional({ example: 'task_created' })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiPropertyOptional({ example: { ip: '127.0.0.1' } })
    @IsOptional()
    @IsObject()
    meta?: Record<string, any>;
}