const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local'),
});

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

const { get404, get500 } = require('./controllers/error');
const setupInitials = require('./utils/setupInitials');
const { isAuthenticated } = require('./utils/auth');
const { upload } = require('./utils/upload');

const PORT = 3000;
const app = express();
const csrfProtection = csurf({});

app.set('view engine', 'ejs');
app.set('views', path.join('views', 'ejs'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.single('image')); // upload should be added before csrf
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/tmp/uploads', express.static(path.join(process.cwd(), 'tmp/uploads')));

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

app.use((req, res, next) => {
  res.locals.isAuthenticated = isAuthenticated(req);
  res.locals.csrfToken = req.csrfToken();
  res.locals.path = req.url;
  res.locals.params = req.params;

  next();
});

app.use(userMiddleware);

app.use('/admin', adminData.router);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', get500);

app.use(get404);

app.use((err, req, res, next) => {
  console.log('err', err);
  res.redirect('/500');
});

connectToDb()
  .then(setupInitials)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\napp listening at http://localhost:${PORT}\n`);
    });
  });
