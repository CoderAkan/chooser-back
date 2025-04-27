import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // Configure CORS more explicitly
  app.enableCors({
    origin: '*', // In production, you might want to restrict this to your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Use PORT from environment variable (Vercel will provide this)
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}
bootstrap();