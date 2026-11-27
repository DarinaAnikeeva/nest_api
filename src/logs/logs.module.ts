import { MongooseModule } from "@nestjs/mongoose";
import { Log, LogSchema } from "./schemas/log.schema.js";
import { LogsController } from "./logs.controller.js";
import { LogsService } from "./logs.service.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    ],
    controllers: [LogsController],
    providers: [LogsService],
})
export class LogsModule { }