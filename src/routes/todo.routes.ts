import { Router } from 'express';
import {
  todoController,
  createTodoSchema,
  updateTodoSchema,
  todoQuerySchema,
  todoIdSchema,
} from '../controllers/todoController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, validateBody, validateParams, validateQuery } from '../middlewares/validate.js';

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(todoQuerySchema), todoController.getAll);

router.post('/', validateBody(createTodoSchema), todoController.create);

router.get('/:id', validateParams(todoIdSchema), todoController.getById);

router.patch(
  '/:id',
  validate({ params: todoIdSchema, body: updateTodoSchema }),
  todoController.update
);

router.delete('/:id', validateParams(todoIdSchema), todoController.delete);

export default router;
