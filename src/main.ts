import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://connectbankers.com',
      'https://brokerf2.netlify.app',
       'http://localhost:3000',
      'https://banker.f2fintech.in', //live
       
    ],
    methods: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port as number);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
