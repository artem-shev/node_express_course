export const throw400 = (msg = 'Bad Request', errorsArr?: any[]) => {
  const err = new Error(msg);
  (err as any).statusCode = 400;
  if (errorsArr) (err as any).errors = errorsArr;

  throw err;
};

export const throw404 = (msg = 'Not Found!') => {
  const err = new Error(msg);
  (err as any).statusCode = 404;

  throw err;
};
