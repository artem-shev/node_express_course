const cookie = require('cookie');

module.exports.isAuthenticated = (req) => {
  const reqCookie = req.get('Cookie');
  const parsedCookie = cookie.parse(reqCookie);

  return !!req.session.user;
};

module.exports.SALT_ROUNDS = 12;
