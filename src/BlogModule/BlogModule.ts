import { Module } from '@nestjs/common';
import { BlogController } from './BlogController';
import { BlogService } from './BlogService';
import { Blog } from '../Models/BlogModel';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
