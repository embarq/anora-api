import { Router } from 'express';
import { Connection } from 'mongoose';

import { getBoardsController } from './boards.controller';

export const getBoardsRouter = (connection: Connection) => {
  const boardsRouter = Router();
  const boardsController = getBoardsController(connection);

  boardsRouter.get('/', boardsController.getAllBoards);
  boardsRouter.get('/:id', boardsController.getBoard);
  boardsRouter.post('/', boardsController.create);

  return boardsRouter;
}
