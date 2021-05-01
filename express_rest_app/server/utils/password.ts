import bcrypt from 'bcryptjs';

export const JWT_SECRET = 'someverysecuresecretkey';
export const TOKEN_EXPIRATION_TIME = '24h';
export const SALT_ROUNDS = 12;

export const encryptPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);

export const checkPasswordMatch = (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);
