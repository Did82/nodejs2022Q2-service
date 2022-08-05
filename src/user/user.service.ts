import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { hash, compare } from 'bcryptjs';

const salt: number = parseInt(process.env.CRYPT_SALT, 10);

@Injectable()
export class UserService {
  // private readonly logger = new Logger(UserService.name);
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const createdAt = Date.now();
    const updatedAt = createdAt;
    createUserDto.password = await hash(createUserDto.password, salt);
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        createdAt,
        updatedAt,
      },
    });
    return plainToInstance(UserEntity, newUser);
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login },
      select: {
        id: true,
        login: true,
        password: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordCorrect = await compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
    const updatedAt = Date.now();
    const newVersion = user.version + 1;
    updateUserDto.password = await hash(updateUserDto.newPassword, salt);
    const newUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        updatedAt,
        version: newVersion,
      },
    });
    return plainToInstance(UserEntity, newUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.delete({ where: { id } });
  }
}
