import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from '@config/cors.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api/");
  app.enableCors(CORS);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  await app.listen(configService.get<string>("port") ?? 3000);
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
