import { Response } from 'express';

export const baseRequestHandler = (response: Response, promise: Promise<any>) => promise
  .then(result => response.status(200).json(result))
  .catch(err => response.status(400).json({
    message: err.message
  }))
