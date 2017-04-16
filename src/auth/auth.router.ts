import { Router } from 'express';
import { Connection } from 'mongoose';
import { getAuthController } from './auth.controller';

/** Connection -> AuthControllerMethods -> Router */
export const getAuthRouter = (connection: Connection): Router => {
  const authRouter = Router();
  const authController = getAuthController(connection);

  authRouter.post('/register', authController.register);

  return authRouter;
}
