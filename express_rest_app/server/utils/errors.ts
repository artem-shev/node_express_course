export const throw400 = (msg = 'Bad Request', errorsArr?: any[], data?: any) => {
  const err = new Error(msg);
  (err as any).statusCode = 400;

  if (errorsArr) (err as any).errors = errorsArr;
  if (data) (err as any).data = data;

  throw err;
};

export const throw401 = (msg = 'Unauthorized') => {
  const err = new Error(msg);
  (err as any).statusCode = 401;

  throw err;
};

export const throw403 = (msg = 'Forbidden') => {
  const err = new Error(msg);
  (err as any).statusCode = 403;

  throw err;
};

export const throw404 = (msg = 'Not Found!') => {
  const err = new Error(msg);
  (err as any).statusCode = 404;

  throw err;
};

export const throw500 = (msg = 'Something went wrong') => {
  const err = new Error(msg);
  (err as any).statusCode = 500;

  throw err;
};
