import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Database } from '../utils/database';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private db: Database) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.db.addUser(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.db.getUsers();
  }

  async findOne(id: string): Promise<User> {
    return await this.db.getUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.db.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.db.deleteUser(id);
  }
}
