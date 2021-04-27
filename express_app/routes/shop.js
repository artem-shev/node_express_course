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
  postOrder,
  getInvoice,
} = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/', getIndex);
router.route('/cart').get(isAuth, getCart).post(isAuth, postCart);
router.get('/orders', isAuth, getOrders);
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);
router.get('/checkout', isAuth, getCheckout);
router.post('/cart-delete-item', isAuth, postCartDeleteProduct);
router.post('/create-order', isAuth, postOrder);
router.get('/orders/:orderId', isAuth, getInvoice);

module.exports = router;
