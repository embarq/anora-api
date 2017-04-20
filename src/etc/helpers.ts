import { Response } from 'express';
import { ValidationError } from 'mongoose';
import ExpressValidator = require('express-validator');
import { sign, verify } from 'jsonwebtoken';
import { cert } from '../etc/config';

export const encodeToken = (payload: any) => new Promise<any>((resolve, reject) =>
  sign(payload, cert, { expiresIn: '3 days' }, (err, encoded) =>
    err != null ? reject(err) : resolve(encoded)));

export const decodeToken = (token: string) => new Promise<any>((resolve, reject) =>
  verify(token, cert, (err, decoded) =>
    err != null ? reject(err) : resolve(decoded)));

export class RequestValidationError extends Error {
  public readonly name: 'RequestValidationError';

  constructor(public error: ExpressValidator.Dictionary<ExpressValidator.MappedError>) {
    super();
  }
}

export const getValidationErrorResponse = err => {
  if (!(err instanceof RequestValidationError)) {
    return {
      content: {
        message: err.message
      },
      type: 'system'
    }
  }
  return {
    content: err.error,
    type: 'validation'
  };
}

export const baseRequestHandler = (response: Response, promise: Promise<any>) => promise
  .then(result => response
    .status(200)
    .json(result)
    .end())
  .catch(err => response
    .status(400)
    .json({
      content: {
        message: err.message
      },
      type: 'system'
    })
    .end());

export const validatedRequestHandler = (
  response: Response,
  validator: () => Promise<ExpressValidator.Result>,
  procedure: () => Promise<any>
) => validator().then(validationResult => {
    if (!validationResult.isEmpty()) {
      throw new RequestValidationError(validationResult.mapped());
    }

    return procedure();
  })
  .then(result => response
    .status(200)
    .json(result)
    .end())
  .catch(error => response
    .status(400)
    .json(getValidationErrorResponse(error))
    .end());
