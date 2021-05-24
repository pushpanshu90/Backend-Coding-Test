import { LoginModel } from './../Models/UserModel';
import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './UserService';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Users, FirebaseSignupModel } from 'src/Models/UserModel';
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('/user/adduser')
  // @ApiBody({ type: Users })
  // signUpUser(@Req() request: Request): Promise<object> {
  //   return this.userService.addUser(request.body);
  // }
  @Post('/user/createuser')
  @ApiTags('Create User on Firebase')
  @ApiBody({ type: FirebaseSignupModel })
  createUserFirebase(@Req() request: Request): Promise<object> {
    return this.userService.createUserFirebase(request.body);
  }

  @Post('/user/login')
  @ApiTags('Login User using Firebase')
  @ApiBody({ type: LoginModel })
  loginUser(@Req() request: Request): Promise<object> {
    return this.userService.loginUser(request.body);
  }
}
