import { Router } from 'express';

import { getPosts, createPost, validateCreatePost } from '../controllers/feed';

const router = Router();

router.get('/posts', getPosts);
router.post('/post', validateCreatePost, createPost);

export default router;
