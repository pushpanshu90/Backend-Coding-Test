import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { BlogService } from './BlogService';
import { ApiBearerAuth, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { Blog } from 'src/Models/BlogModel';
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @Post('/addblog')
  @ApiBody({ type: Blog })
  async signUpUser(@Req() request: Request): Promise<object> {
    return this.blogService.addBlog(request.body);
  }
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List all blogs' })
  @Get('/getblogs')
  getUsers(@Query() query) {
    return this.blogService.getBlogs(query);
  }
}
