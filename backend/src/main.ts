// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for your Vercel frontend URL
  app.enableCors({
    origin: [
      'https://payroll-system-jet.vercel.app',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 2. Global Validation
  app.useGlobalPipes(new ValidationPipe());

  // 3. Bind to 0.0.0.0 and use Render's PORT
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on port: ${port}`);
}
bootstrap();
