import { Router } from 'express';
import { Connection } from 'mongoose';

import { authMiddleware } from '../auth/auth.middleware';
import { getBoardsController } from './boards.controller';

export const getBoardsRouter = (connection: Connection) => {
  const boardsRouter = Router();
  const boardsController = getBoardsController(connection);

  boardsRouter.use(authMiddleware);

  boardsRouter.get('/', boardsController.getAllBoards);
  boardsRouter.get('/:id', boardsController.getBoard);
  boardsRouter.post('/', boardsController.create);

  return boardsRouter;
}
