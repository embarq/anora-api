import { RequestHandler } from 'express';
import { Connection, Document, Model } from 'mongoose';
import { getUserModel } from '../user/user.model';

/** Model -> User > Promise */
const registerUser = (model: Model<Document>) => user => model.create(user);

export interface AuthControllerMethods {
  login: RequestHandler,
  register: RequestHandler
}

/** Connection -> Model -> AuthControllerMethods */
export const getAuthController = (connection: Connection): AuthControllerMethods => {
  const Model = getUserModel(connection);

  return {
    login: (req, res) => null,
    register: (req, res) => registerUser(Model)(req.body)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(400).json({ message: err.message }))
  }
}
