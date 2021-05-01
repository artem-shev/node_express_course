import { makeAsyncMiddleware } from '../utils/express';
import User from '../models/user';
import { throw404 } from '../utils/errors';
import { body } from 'express-validator';

export const getUserStatus = makeAsyncMiddleware(async (req, res) => {
  // @ts-ignore
  const { userId } = req;

  const user = await User.findById(userId);

  if (!user) return throw404();

  res.status(200).json({ status: user.status });
});

export const validateStatus = [body('status').trim().not().isEmpty()];

export const updateUserStatus = makeAsyncMiddleware(async (req, res) => {
  const {
    // @ts-ignore
    userId,
    body: { status },
  } = req;

  const user = await User.findById(userId);

  if (!user) return throw404();

  user.status = status;

  await user.save();

  res.status(200).json({ message: 'updated', status });
});
