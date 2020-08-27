const express = require('express');

const { getAddProduct, postAddProduct } = require('../controllers/products');

const router = express.Router();

// /admin/add-product
router.route('/add-product').get(getAddProduct).post(postAddProduct);

module.exports = { router };
