import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Database, db } from '../utils/database';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, Database],
})
export class UserModule {}
