import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
