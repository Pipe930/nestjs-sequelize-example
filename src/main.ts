import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './config/cors.config'; 
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.setGlobalPrefix("api/");
  app.enableCors(CORS);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  const config = new DocumentBuilder()
  .setTitle("Nestjs Sequelize Implementation Example")
  .setDescription("A sample Rest API implementing the Sequelize ORM with Nestjs")
  .setVersion("1.0")
  .addApiKey()
  .addCookieAuth("access_token")
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("documentation", app, document);

  await app.listen(configService.get<string>("port") ?? 3000);
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
