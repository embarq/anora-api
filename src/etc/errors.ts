import ExpressValidator = require('express-validator');

export class HttpError extends Error {
  constructor(public code: number, message: string) {
     super(message);
     Object.setPrototypeOf(this, HttpError.prototype);
   }
}

export class RequestValidationError extends Error {
  public readonly name: 'RequestValidationError';

  constructor(public error: ExpressValidator.Dictionary<ExpressValidator.MappedError>) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
