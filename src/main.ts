import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './controllers/filters/global-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  const config = new DocumentBuilder()
    .setTitle('Cookly Content Service')
    .setDescription('API for managing recipes and collections')
    .setVersion('1.0')
    .addTag('recipes', 'Recipe operations')
    .addTag('collections', 'Collection operations')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-Session-ID',
        description: 'Session identifier',
      },
      'X-Session-ID',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
