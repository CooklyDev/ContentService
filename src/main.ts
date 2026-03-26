import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './controllers/filters/global-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
