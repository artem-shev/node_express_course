const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csurf = require('csurf');
const flash = require('connect-flash');

const { connectToDb, sessionStore } = require('./utils/database');

const userMiddleware = require('./middlewares/user');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const { get404 } = require('./controllers/error');
const setupInitials = require('./utils/setupInitials');
const { isAuthenticated } = require('./utils/auth');

const PORT = 3000;
const app = express();
const csrfProtection = csurf({});

app.set('view engine', 'ejs');
app.set('views', path.join('views', 'ejs'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // maxAge: 1000 * 60 * 60 * 24 * 3
    },
    store: sessionStore,
  }),
);
app.use(csrfProtection);
app.use(flash());
app.use(userMiddleware);

app.use((req, res, next) => {
  res.locals.isAuthenticated = isAuthenticated(req);
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminData.router);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

connectToDb()
  .then(setupInitials)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\napp listening at http://localhost:${PORT}\n`);
    });
  });
