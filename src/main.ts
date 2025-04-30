import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from '@config/cors.config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(CORS);

  await app.listen(configService.get<string>("port") ?? 3000);
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
