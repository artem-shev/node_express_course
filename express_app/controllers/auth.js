const User = require('../models/user');

module.exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.isAuthenticated,
  });
};

module.exports.postLogin = async (req, res, next) => {
  req.session.user = await User.findOne({ email: 'admin@admin.com' });
  req.session.isAuthenticated = true;

  req.session.save(() => {
    res.redirect('/');
  });
};

module.exports.getLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
