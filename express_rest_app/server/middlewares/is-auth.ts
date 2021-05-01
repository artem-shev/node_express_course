import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/password';
import { throw401, throw500 } from '../utils/errors';

const isAuth: RequestHandler = (req, res, next) => {
  try {
    const [, token] = req.get('Authorization').split(' ');
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // @ts-ignore
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    return throw401();
  }
};

export default isAuth;
