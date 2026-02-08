import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validate.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);

router.post('/login', validateBody(loginSchema), authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getMe);

export default router;
