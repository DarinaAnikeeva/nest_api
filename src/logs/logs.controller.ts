import { Body, Controller, Get, Param, Post, Patch, Delete, Query } from "@nestjs/common";
import { CreateLogDto } from "./dto/create-log.dto.js";
import { LogsService } from "./logs.service.js";
import { UpdateLogDto } from "./dto/update-log.dto.js";

@Controller('logs')
export class LogsController {
    constructor(private logsService: LogsService) { }

    @Post() create(@Body() dto: CreateLogDto) { return this.logsService.create(dto); }
    @Get() findAll() { return this.logsService.findAll(); }
    @Get('stats') stats(@Query('userId') userId?: string) { return this.logsService.getStats(userId); }
    @Get(':id') findOne(@Param('id') id: string) { return this.logsService.findOne(id); }
    @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateLogDto) { return this.logsService.update(id, dto); }
    @Delete(':id') remove(@Param('id') id: string) { return this.logsService.remove(id); }
}