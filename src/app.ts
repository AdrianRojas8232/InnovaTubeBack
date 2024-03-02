import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: [
      'http://192.168.137.158:5000',
      // 'http://192.168.247.158:8001',
      // 'http://192.168.247.162:8080',
      // 'http://192.168.247.62',
      // 'http://192.168.247.62:80',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} -npm IP: ${req.ip}`);
    next();
  });
  
  app.setGlobalPrefix('api');
  
  await app.listen(port);

  console.log(`Servidor escuchando en el puerto ${port}`);
}

bootstrap();