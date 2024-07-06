// src/main.ts
require('module-alias/register')
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationFilter } from './shared/validation/validation.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use(helmet());

  app.useGlobalFilters(new ValidationFilter());

  const config = new DocumentBuilder()
    .setTitle('Accounting API')
    .setVersion('3.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();