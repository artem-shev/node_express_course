const { isAuthenticated } = require('../utils/auth');

module.exports = (req, res, next) => {
  if (!isAuthenticated(req)) {
    req.flash('error', 'Unauthorized');
    return res.redirect('/login');
  }

  next();
};
