const { Router } = require('express');
const authController = require('../controllers/auth');

const router = Router();

router.route('/login').get(authController.getLogin).post(authController.postLogin);
router.route('/signup').get(authController.getSignup).post(authController.postSignup);
router.route('/reset').get(authController.getReset).post(authController.postReset);

router.get('/logout', authController.getLogout);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
