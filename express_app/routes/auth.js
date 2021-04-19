const { Router } = require('express');
const authController = require('../controllers/auth');

const router = Router();

router.route('/login').get(authController.getLogin).post(authController.postLogin);
router.route('/signup').get(authController.getSignup).post(authController.postSignup);

router.get('/logout', authController.getLogout);

module.exports = router;
