import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import parseYaml from './utils/parseYaml';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const document = parseYaml();
  SwaggerModule.setup('api', app, <OpenAPIObject>document);
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
