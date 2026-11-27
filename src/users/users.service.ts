import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entity/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  create(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.usersRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filterName?: string,
  ) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task')
      .orderBy('user.id', 'ASC');

    if (filterName) {
      queryBuilder.andWhere('user.name LIKE :name', {
        name: `%${filterName}%`,
      });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllWithNPlusOneProblem() {
    const users = await this.usersRepository.find();

    for (const user of users) {
      user.tasks = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.tasks', 'task')
        .where('user.id = :id', { id: user.id })
        .getOne()
        .then((u) => u?.tasks || []);
    }

    return users;
  }

  async findAllOptimized() {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task')
      .getMany();
  }
}