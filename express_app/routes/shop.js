const path = require('path');
const express = require('express');

const { products } = require('./admin');
const { ROOT_DIR } = require('../utils/constants');

const router = express.Router();

router.get('/', (req, res, next) => {
  // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
});

module.exports = router;
