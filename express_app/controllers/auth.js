const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/auth');

module.exports.getLogin = (req, res, next) => {
  console.log('sdg', req.flash('error'));
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error'),
  });
};

module.exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  try {
    // @ts-ignore
    if (!user?.email) throw new Error('Not Found');
    // @ts-ignore
    const isPasswordMatch = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatch) throw new Error('Wrong Password');

    req.session.user = user;
    req.session.isAuthenticated = true;

    return req.session.save(() => {
      res.redirect('/');
    });
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/login');
  }
};

module.exports.getLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

module.exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: req.flash('error'),
  });
};

module.exports.postSignup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const userDoc = await User.findOne({ email });

  if (userDoc) {
    req.flash('error', 'Email already taken.');
    return res.redirect('/signup');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await new User({ email, password: hashedPassword, cart: { items: [] } }).save();

  return res.redirect('/login');
};
