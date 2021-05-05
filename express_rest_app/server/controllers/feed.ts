import { body, validationResult } from 'express-validator';

import socket from '../socket';
import Post from '../models/post';
import User from '../models/user';
import { makeAsyncMiddleware } from '../utils/express';
import imageUpload, { clearImage } from '../utils/imageUpload';
import { throw404, throw400, throw403 } from '../utils/errors';

export const getPosts = makeAsyncMiddleware(async (req, res, next) => {
  const { page = '1', itemsPerPage = '2' } = req.query;

  const processedPage = Number(page);
  const processedItemPerPage = Number(itemsPerPage);

  const totalItems = await Post.countDocuments();
  const skip = (processedPage - 1) * processedItemPerPage;
  const limit = processedItemPerPage;
  const meta = {
    totalItems,
    page: processedPage,
    itemsPerPage: processedItemPerPage,
  };

  const posts = await Post.find()
    .populate('creator')
    .sort({ createdAt: 'desc' })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    posts,
    totalItems,
    meta,
  });
});

export const getPost = makeAsyncMiddleware(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) throw404();

  res.status(200).json({ post, message: 'post fetched.' });
});

export const processCreatePost = imageUpload.single('image');

export const validateCreatePost = [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
];

export const createPost = makeAsyncMiddleware(async (req, res, next) => {
  let { title, content, imageUrl } = req.body;
  // @ts-ignore
  const { userId } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw400('Validation failed!', errors.array());

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    imageUrl = 'https://i.pinimg.com/474x/a6/1e/89/a61e8974159fe112a6357314342f87b1.jpg';
  }

  const post = await new Post({ title, content, imageUrl, creator: userId }).save();
  const user = await User.findById(userId);

  user.posts.push(post);

  await user.save();

  socket.io.emit('posts', { action: 'create', post: { ...post.toObject(), creator: user } });

  res.status(201).json({
    message: 'Post created successfully!',
    post,
    creator: { _id: user._id, name: user.name },
  });
});

export const editPost = makeAsyncMiddleware(async (req, res) => {
  let { image: imageUrl } = req.body;
  const {
    body: { title, content },
    params: { postId },
    file,
  } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw400('Validation failed!', errors.array());

  if (imageUrl === 'undefined') imageUrl = undefined;
  if (file) imageUrl = file.path;

  const post = await Post.findById(postId).populate('creator');

  if (!post) return throw404();
  // @ts-ignore
  if (post.creator._id.toString() !== req.userId) return throw403();

  if (imageUrl && !post.imageUrl?.includes('http') && imageUrl !== post.imageUrl) {
    clearImage(post.imageUrl);
  }

  Object.assign(post, { imageUrl, title, content });

  const updatedPost = await post.save();

  socket.io.emit('posts', { action: 'update', post: updatedPost });

  res.status(200).json({ message: 'post updated', post });
});

export const deletePost = makeAsyncMiddleware(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) return throw404();
  // @ts-ignore
  if (post.creator._id.toString() !== req.userId) return throw403();
  if (!post.imageUrl?.includes('http')) clearImage(post.imageUrl);

  await post.delete();

  // @ts-ignore
  await User.updateOne({ _id: req.userId }, { $pull: { posts: post._id } });

  socket.io.emit('posts', { action: 'delete', post: postId });

  res.status(200).json({ message: 'deleted' });
});
