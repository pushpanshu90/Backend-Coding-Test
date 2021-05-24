import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './BlogModule/BlogModule';
import { Users } from './Models/UserModel';
import { Blog } from './Models/BlogModel';
import { UserModule } from './UserModule/UserModule';
import { UserTokenMiddleWare } from './usertoken.middleware';
import { AdminTokenMiddleware } from './admintoken.middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        'postgres://xgrundkp:O5UgZHbmYZv7tY5TaTZ5YK6YgrHhPK9g@batyr.db.elephantsql.com/xgrundkp',

      entities: [Users, Blog],
    }),
    UserModule,
    BlogModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserTokenMiddleWare)
      .forRoutes({ path: 'auth/user/adduser', method: RequestMethod.POST });

    consumer
      .apply(AdminTokenMiddleware)
      .forRoutes({ path: 'blog/*', method: RequestMethod.ALL });
  }
}
