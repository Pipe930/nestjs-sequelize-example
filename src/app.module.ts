import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigEnvironment } from './config/enviroment.config';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/models/user.model'; 
import { RefreshToken } from './modules/users/models/tokenJwt.model';
import { PostsModule } from './modules/posts/posts.module';
import { ContentTypeMiddleware } from './core/middlewares/content-type.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [AppConfigEnvironment]
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get("database.dialect"),
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        models: [User, RefreshToken],
        logging: false,
        synchronize: true,
        autoLoadModels: true
      }),
      inject: [ConfigService]
    }),
    MorganModule,
    UsersModule,
    AuthModule,
    PostsModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined")
    }
  ]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContentTypeMiddleware).forRoutes(
      {
        path: '*',
        method: RequestMethod.POST
      }, 
      {
        path: '*',
        method: RequestMethod.PUT
      }
    );
  }
}
