import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { makeAsyncMiddleware } from '../utils/express';
import User from '../models/user';
import { throw400, throw401, throw404 } from '../utils/errors';
import {
  checkPasswordMatch,
  encryptPassword,
  JWT_SECRET,
  TOKEN_EXPIRATION_TIME,
} from '../utils/password';

export const validateSignup = [
  body('email', 'Invalid email.')
    .normalizeEmail()
    .isEmail()
    .custom(async (value, meta) => {
      const user = await User.findOne({ email: value });

      if (user) throw new Error('Email already taken!');

      return true;
    }),
  body('name').not().isEmpty(),
  body('password').trim().isLength({ min: 5 }),
];

export const signup = makeAsyncMiddleware(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw400('Validation failed!', undefined, errors.array());

  const { name, email, password } = req.body;

  const hashedPassword = await encryptPassword(password);
  const user = await new User({ name, email, password: hashedPassword }).save();

  res.status(201).json({ message: 'user created', userId: user._id });
});

export const login = makeAsyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return throw404('User not found.');

  const isPasswordMatch = await checkPasswordMatch(password, user.password);

  if (!isPasswordMatch) return throw401();

  const userId = user._id.toString();
  const token = jwt.sign({ email, userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION_TIME,
  });

  res.status(200).json({ token, userId });
});
