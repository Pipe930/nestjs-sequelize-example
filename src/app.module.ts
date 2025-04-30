import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@core/database/database.module';
import { AppConfigEnvironment } from '@config/enviroment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [AppConfigEnvironment]
    }),
    DatabaseModule
  ],
})
export class AppModule {}
