import { Router } from 'express';
import isAuth from '../middlewares/is-auth';
import { getUserStatus, updateUserStatus } from '../controllers/user';

const router = Router();

router.use(isAuth);

router.route('/status').get(getUserStatus).put(updateUserStatus);

export default router;
