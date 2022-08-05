import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import parseYaml from './utils/parseYaml';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(AppModule.name, { timestamp: true });
  app.useGlobalPipes(new ValidationPipe());
  const document = parseYaml();
  SwaggerModule.setup('api', app, <OpenAPIObject>document);
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
