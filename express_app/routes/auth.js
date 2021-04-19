const { Router } = require('express');
const authController = require('../controllers/auth');

const router = Router();

router.route('/login').get(authController.getLogin).post(authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;
