import { Express, Request, RequestHandler } from 'express';
import { decodeToken } from '../etc/helpers';
import { User } from '../user/user.model';

export interface AnoraAuthRequest extends Request {
  user: string;
}

export const authMiddleware: RequestHandler = (req: AnoraAuthRequest, res, next) => {
  const token = req.query.token || req.headers.token || null;

  if (token != null) {
    return decodeToken(token)
      .then(payload => {
        req.user = payload._doc._id;
        next();
      })
      .catch(err => res
        .status(403)
        .json({
          type: 'auth',
          message: 'Unauthorized: token malformed'
        }));
  } else {
    return res
      .status(403)
      .json({
        type: 'auth',
        message: 'Unauthorized: token is not present'
      })
      .end();
  }
}
