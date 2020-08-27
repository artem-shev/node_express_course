const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { ROOT_DIR } = require('./utils/constants');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(ROOT_DIR, 'views', '404.html'));
});

app.listen(3000);
