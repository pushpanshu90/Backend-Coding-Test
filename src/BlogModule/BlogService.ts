import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../Models/BlogModel';
import firebase from 'firebase';
import { APIResponse } from '../Common/APIResponse';
import { v4 } from 'uuid';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class BlogService {
  constructor(@InjectRepository(Blog) private blogRepo: Repository<Blog>) {}

  async addBlog(blogModel): Promise<object> {
    try {
      checkBlogConditions(blogModel);
      const blog: Blog = getBlogModelAfterSettingVariables(blogModel);

      const savedBlog: Blog = await this.blogRepo.save(blog);
      await createBlogInFirestore(savedBlog);
      return APIResponse(true, savedBlog);
    } catch (err) {
      return err;
    }
  }
  @Cron('0 30 16 * * 1-7') //Monday to Sunday at 04:30pm
  async updateBlog(): Promise<void> {
    try {
      const listBlog: Array<Blog> = await this.blogRepo.query(
        'SELECT * FROM blog',
      );
      const things = ['Rock', 'Paper', 'Scissor'];
      const randomKey = things[Math.floor(Math.random() * things.length)];
      listBlog.forEach((item: Blog) => {
        this.updateEachBlog(item, randomKey);
        updateBlogInFirestore(item, randomKey);
      });
      //return APIResponse(true, savedBlog);
    } catch (err) {
      return err;
    }
  }
  async updateEachBlog(item: Blog, randomKey): Promise<void> {
    const { id, title } = item;
    console.log(item);

    const queryblog = `UPDATE blog SET title = '${title} ${randomKey}' where id = '${id}'`;
    try {
      await this.blogRepo.query(queryblog);
    } catch (err) {
      return err;
    }
  }
  async getBlogs(query): Promise<object> {
    let page = 0;
    if (query.page && query.page > 0) {
      page = query.page;
    }
    let totalPages = await this.blogRepo.query('SELECT COUNT(*) FROM blog');
    totalPages = Math.floor(totalPages[0].count / 10);
    const blogs = await this.blogRepo.query(formBlogQuery(page));
    const response = {
      page: page,
      blogs: blogs,
      totalpages: totalPages,
      pageLimit: 10,
    };
    return APIResponse(true, response);
  }
}

async function createBlogInFirestore(blog: Blog) {
  const db = firebase.database();
  await db
    .ref(`blogs/Blog_${blog.getId()}`)
    .set(JSON.parse(JSON.stringify(blog)));
}
async function updateBlogInFirestore(item: Blog, randomKey) {
  const { id, title } = item;

  const db = firebase.database();
  await db.ref(`blogs/Blog_${id}`).update({
    title: `${title} ${randomKey}`,
  });
}

function getBlogModelAfterSettingVariables(blog): Blog {
  const blogModel = new Blog();
  blogModel.setArticleBody(blog.body);
  blogModel.setArticleTitle(blog.title);
  blogModel.setDate(new Date().toLocaleString());
  blogModel.setId(v4());
  return blogModel;
}

function formBlogQuery(page) {
  const offset = page ? page : 0;
  return `SELECT * FROM blog ORDER BY "title" LIMIT 10 OFFSET ${offset}`;
}

function checkBlogConditions(blog) {
  if (!blog.title) {
    throw new Error('Title of the blog cannot be null');
  }

  if (!blog.body) {
    throw new Error('Body of the blog cannot be null or empty');
  }
}
