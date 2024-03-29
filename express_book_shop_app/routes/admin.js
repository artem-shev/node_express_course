const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.use('*', isAuth);

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.validatePostProduct, adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.validatePostProduct, adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

router.delete('/products/:productId', adminController.deleteProduct);

module.exports = { router };
