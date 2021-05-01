import { Router } from 'express';

import {
  getPosts,
  createPost,
  validateCreatePost,
  getPost,
  processCreatePost,
  editPost,
  deletePost,
} from '../controllers/feed';

const router = Router();

router.get('/posts', getPosts);
router
  .route('/posts/:postId')
  .get(getPost)
  .put(processCreatePost, validateCreatePost, editPost)
  .delete(deletePost);
router.post('/post', processCreatePost, validateCreatePost, createPost);

export default router;
