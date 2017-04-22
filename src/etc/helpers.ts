import { Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { cert } from '../etc/config';
import { HttpError, RequestValidationError } from './errors';

export const encodeToken = (payload: any) => new Promise<any>((resolve, reject) =>
  sign(payload, cert, { expiresIn: '3 days' }, (err, encoded) =>
    err != null ? reject(err) : resolve(encoded)));

export const decodeToken = (token: string) => new Promise<any>((resolve, reject) =>
  verify(token, cert, (err, decoded) =>
    err != null ? reject(err) : resolve(decoded)));

export const getErrorResponseBody = (err: Error | HttpError | RequestValidationError) => {
  if (err instanceof RequestValidationError) {
    return {
      content: err.error,
      type: 'validation'
    };
  }
  return {
    content: {
      message: err.message
    },
    type: 'system'
  }
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
  .catch(err => response
    .status(err instanceof HttpError ? err.code : 400)
    .json(getErrorResponseBody(err))
    .end());
