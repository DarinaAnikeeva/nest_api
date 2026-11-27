import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema.js';
import { CreateLogDto } from './dto/create-log.dto.js';
import { UpdateLogDto } from './dto/update-log.dto.js';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private logModel: Model<LogDocument>,
  ) {}

  findAll() { return this.logModel.find().exec(); }

  findOne(id: string) { return this.logModel.findById(id).exec(); }

  create(dto: CreateLogDto) { return this.logModel.create(dto); }

  update(id: string, dto: UpdateLogDto) {
    return this.logModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  remove(id: string) {
    return this.logModel.findByIdAndDelete(id).exec();
  }

  getStats(userId?: string) {
    return this.logModel.aggregate([
      { $match: userId ? { userId } : {} },
      { $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastAt: { $max: '$createdAt' },
      }},
      { $sort: { count: -1 } },
    ]);
  }
}