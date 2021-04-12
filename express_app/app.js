const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

require('./models');
const sequelize = require('./utils/database');
const User = require('./models/user');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const { get404 } = require('./controllers/error');

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join('views', 'ejs'));

app.use(async (req, res, next) => {
  req.user = await User.findByPk(1);

  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use(get404);

sequelize
  // .sync({ force: true })
  .sync()
  .then(async () => {
    let user = await User.findByPk(1);

    if (!user) {
      user = await User.create({ name: 'admin', email: 'admin@admin.com' });
    }

    return user;
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\napp listening at http://localhost:${PORT}\n`);
    });
  });
