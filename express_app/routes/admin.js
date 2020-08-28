const express = require('express');

const { getAddProduct, postAddProduct, getProducts } = require('../controllers/admin');

const router = express.Router();

// /admin/add-product
router.route('/add-product').get(getAddProduct).post(postAddProduct);

router.get('/products', getProducts);

module.exports = { router };
