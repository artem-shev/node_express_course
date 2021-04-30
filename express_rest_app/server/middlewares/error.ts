import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('err', err);

  const { statusCode = 500, message, errors } = err;

  res.status(statusCode).json({ message, errors });
};

export default errorHandler;
