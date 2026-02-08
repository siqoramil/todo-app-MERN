import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import todoRoutes from './todo.routes.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

export default router;
