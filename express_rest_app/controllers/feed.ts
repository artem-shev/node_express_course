import { RequestHandler } from 'express';
import { lorem } from 'faker';
import { v4 } from 'uuid';

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: 'First Pose', content: lorem.sentences(2) },
      { title: 'Second Pose', content: lorem.sentences(2) },
    ],
  });
};

export const createPost: RequestHandler = (req, res, next) => {
  const { title, content } = req.body;

  res
    .status(201)
    .json({ message: 'Post created successfully!', post: { title, content, id: v4() } });
};
