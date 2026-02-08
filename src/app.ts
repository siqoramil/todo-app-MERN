import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

export const createApp = (): Express => {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  setupSwagger(app);

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
