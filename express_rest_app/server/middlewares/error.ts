import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('err', err);

  const { statusCode = 500, message, errors, data } = err;

  res.status(statusCode).json({ message, errors, data });
};

export default errorHandler;
