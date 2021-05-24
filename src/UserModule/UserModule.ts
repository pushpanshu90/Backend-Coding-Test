import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './UserController';
import { Users } from '../Models/UserModel';
import { UserService } from './UserService';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
