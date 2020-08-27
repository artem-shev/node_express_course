const express = require('express');
const path = require('path');

const { ROOT_DIR } = require('../utils/constants');

const router = express.Router();

// /admin/add-product
router
  .route('/add-product')
  .get((req, res, next) => {
    res.sendFile(path.join(ROOT_DIR, 'views', 'add_product.html'));
  })
  .post((req, res, next) => {
    console.log('req.body', req.body);
    res.redirect('/');
  });

module.exports = router;
