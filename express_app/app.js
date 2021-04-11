const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const { get404 } = require('./controllers/error');

const PORT = 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join('views', 'ejs'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use(get404);

app.listen(PORT, () => {
  console.log(`\napp listening at http://localhost:${PORT}\n`);
});
