import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.info(`🚀 Server running on port ${env.PORT}`);
      console.info(`📚 Swagger UI: http://localhost:${env.PORT}/api/docs`);
      console.info(`🏥 Health check: http://localhost:${env.PORT}/api/health`);
      console.info(`🌍 Environment: ${env.NODE_ENV}`);
    });

    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.info(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.info('HTTP server closed');
        await disconnectDB();
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
