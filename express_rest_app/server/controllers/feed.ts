import { body, validationResult } from 'express-validator';

import Post from '../models/post';
import { makeAsyncMiddleware } from '../utils/express';

export const getPosts = makeAsyncMiddleware(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    posts,
  });
});

export const validateCreatePost = [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
];

export const createPost = makeAsyncMiddleware(async (req, res, next) => {
  let { title, content, imageUrl } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Validation failed!');
    (err as any).statusCode = 400;
    (err as any).errors = errors.array();

    throw err;
  }

  if (!imageUrl) {
    imageUrl = 'https://i.pinimg.com/474x/a6/1e/89/a61e8974159fe112a6357314342f87b1.jpg';
  }

  const post = await new Post({ title, content, imageUrl, creator: { name: 'Admin' } }).save();

  res.status(201).json({
    message: 'Post created successfully!',
    post,
  });
});
