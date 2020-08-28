const express = require('express');

const { getProducts, getIndex, getCart, getCheckout, getOrders } = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);
router.get('/cart', getCart);
router.get('/orders', getOrders);
router.get('/products', getProducts);
router.get('/products/:productId', () => {});
router.get('/checkout', getCheckout);

module.exports = router;
