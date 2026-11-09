import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Apollo Server 4 on Express requires the JSON body parser to be
  // registered BEFORE the Apollo middleware. NestJS platform-express
  // does not add it automatically when using Apollo Server 4+.
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.setGlobalPrefix('api', {
    // Exclude /graphql so it isn't prefixed to /api/graphql
    exclude: ['graphql'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hotel Price Sync System API')
    .setDescription(
      'Production-grade NestJS backend demonstrating PMS sync, BullMQ queues, and price distribution.',
    )
    .setVersion('1.0')
    .addTag('Hotels', 'Hotel property management and configuration')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  logger.log(`Hotel Price Sync System running on: http://localhost:${port}/api`);
  logger.log(`Swagger OpenAPI Documentation:      http://localhost:${port}/api/docs`);
  logger.log(`GraphQL Playground:                 http://localhost:${port}/graphql`);
}

bootstrap();
