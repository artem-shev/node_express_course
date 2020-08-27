const express = require('express');
const path = require('path');

const { ROOT_DIR } = require('../utils/constants');

const router = express.Router();
const products = [];

// /admin/add-product
router
  .route('/add-product')
  .get((req, res, next) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'add-product.html'));
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
  })
  .post((req, res, next) => {
    const { title } = req.body;
    products.push({ title });
    res.redirect('/');
  });

module.exports = { router, products };
