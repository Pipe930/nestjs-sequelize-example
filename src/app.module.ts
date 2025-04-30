import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@core/database/database.module';
import { AppConfigEnvironment } from '@config/enviroment.config';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [AppConfigEnvironment]
    }),
    DatabaseModule,
    MorganModule,
    UsersModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined")
    }
  ]
})
export class AppModule {}
