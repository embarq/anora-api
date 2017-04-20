import { Express, Request, RequestHandler } from 'express';
import { decodeToken } from '../etc/helpers';
import { User } from '../user/user.model';

interface AnoraAuthRequest extends Request {
  user: User;
}

export const authMiddleware: RequestHandler = (req: AnoraAuthRequest, res, next) => {
  const token = req.query.token || req.headers.token || null;

  if (token != null) {
    return decodeToken(token)
      .then(payload => {
        req.user = payload;
        next();
      })
      .catch(err => next(err));
  } else {
    return res
      .status(403)
      .json({
        type: 'auth',
        message: 'Unauthorized'
      })
      .end();
  }
}
