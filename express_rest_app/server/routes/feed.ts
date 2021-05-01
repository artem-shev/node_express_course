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
import isAuth from '../middlewares/is-auth';

const router = Router();

router.use(isAuth);

router.route('/posts').get(getPosts).post(processCreatePost, validateCreatePost, createPost);
router
  .route('/posts/:postId')
  .get(getPost)
  .put(processCreatePost, validateCreatePost, editPost)
  .delete(deletePost);

export default router;
