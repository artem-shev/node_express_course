const path = require('path');
const express = require('express');

const { ROOT_DIR } = require('../utils/constants');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
});

module.exports = router;
