import { RequestHandler } from 'express';
import { strictEqual } from 'assert';
import { Connection, Document, Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';

import ExpressValidator = require('express-validator');

import { getUserModel, Credentials, User } from '../user/user.model';
import { ControllerMethods } from '../etc/declarations';
import { baseRequestHandler, validatedRequestHandler } from '../etc/helpers';

/**
 * @private
 */
const registerUser = (model: Model<Document>) =>
  (user: User) => hash(user.password, 8)
    .then(hash => model.create(Object.assign(user, { password: hash })));

/**
 * @private
 */
const userDocumentToObject = (doc: Document) => doc.toObject({
  minimize: true,
  transform: (doc, ret) => {
    delete (ret as any).password;
  }
});

/**
 * @private
 */
const validateRegisterForm = (req: ExpressValidator.RequestValidation) => {
  req.checkBody('name', 'Name cannot be empty').notEmpty();
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('password', 'Password should be minimum 8 characters').len({ min: 8 });
  return req.getValidationResult();
}

const validateLoginForm = (req: ExpressValidator.RequestValidation) => {
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('password', 'Password should be minimum 8 characters').len({ min: 8 });
  return req.getValidationResult();
}

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
      return registerUser(model)(user);
    }
  })
  .then(doc => userDocumentToObject(doc));

/** Model -> Credentials -> Promise */
const login = (model: Model<Document>) => credentials => model
  .findOne({ email: credentials.email })
  .exec()
  .then((doc: User) => {
    if (doc == null) {
      throw new Error(`User with email "${ credentials.email }" doesn't exists`);
    }

    return compare(credentials.password, doc.password)
      .then(isMatch => {
        if (isMatch) {
          return userDocumentToObject(doc);
        } else {
          throw new Error('Incorrect password');
        }
      });
  });

/** Connection -> Model -> AuthControllerMethods */
export const getAuthController = (connection: Connection): ControllerMethods => {
  const UserModel = getUserModel(connection);

  return {
    login: (req, res) =>
      validatedRequestHandler(
        res,
        () => validateLoginForm(req),
        () => login(UserModel)(req.body)),

    register: (req, res) =>
      validatedRequestHandler(
        res,
        () => validateRegisterForm(req),
        () => register(UserModel)(req.body))
  }
}
