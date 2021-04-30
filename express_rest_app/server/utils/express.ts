import { RequestHandler } from 'express';

export const makeAsyncMiddleware: (middleware: RequestHandler) => RequestHandler = (middleware) => {
  const asyncRequestHandler: RequestHandler = async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  return asyncRequestHandler;
};
