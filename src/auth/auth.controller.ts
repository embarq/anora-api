import { RequestHandler } from 'express';
import { strictEqual } from 'assert';
import { Connection, Document, Model } from 'mongoose';
import { getUserModel, Credentials, User } from '../user/user.model';

/** Model -> User > Promise */
const register = (model: Model<Document>) => (user: User) => model
  .findOne({
    email: user.email
  })
  .exec()
  .then(doc => {
    if (doc != null) {
      throw new Error(`User with email "${ user.email }" already exists`)
    } else {
      return model.create(user);
    }
  });

/** Model -> Credentials -> Promise */
const login = (model: Model<Document>) => credentials => model
  .findOne({ email: credentials.email })
  .exec()
  .then((doc: User) => {
    if (doc == null) {
      throw new Error(`User with email "${ credentials.email }" doesn't exists`);
    }

    strictEqual(doc.password, credentials.password, 'Incorrect password');

    return doc.toObject({
      minimize: true,
      transform: (doc, ret) => {
        delete (ret as any).password;
      }
    });
  });

export interface AuthControllerMethods {
  login: RequestHandler,
  register: RequestHandler
}

/** Connection -> Model -> AuthControllerMethods */
export const getAuthController = (connection: Connection): AuthControllerMethods => {
  const Model = getUserModel(connection);

  return {
    login: (req, res) => login(Model)(req.body)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(400).json({ message: err.message })),

    register: (req, res) => register(Model)(req.body)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(400).json({ message: err.message }))
  }
}
