const express = require('express');

const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);
router.route('/cart').get(getCart).post(postCart);
router.get('/orders', getOrders);
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);
router.get('/checkout', getCheckout);
router.post('/cart-delete-item', postCartDeleteProduct);

module.exports = router;
