import { IsString, IsOptional } from 'class-validator';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}