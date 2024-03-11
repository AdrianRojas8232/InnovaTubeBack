import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import logger from './utils/loggerApp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors({
    // origin: [
    //   'http://192.168.137.158:5000',
    // ],
    origin:'*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`[${new Date().toLocaleString()}] ${req.method} ${req.url} -npm IP: ${req.ip}`);
    next();
  });
  
  app.setGlobalPrefix('api');
  
  await app.listen(port);

  logger.info(`Servidor escuchando en el puerto ${port}`);
}

bootstrap();