import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { db } from '../utils/database';

@Injectable()
export class UserService {
  private db;
  constructor() {
    this.db = db;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.db.addUser(createUserDto);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.db.getUsers();
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this.db.getUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.db.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    const result = await this.db.deleteUser(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: `User with id: ${id} was deleted` };
  }
}
