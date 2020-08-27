const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine('hbs', expressHandlebars());
app.set('view engine', 'hbs');
app.set('views', path.join('views', 'handlebars'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404'); // pug
});

app.listen(3000);
