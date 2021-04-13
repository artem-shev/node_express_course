const User = require('../models/user');

module.exports = async (req, res, next) => {
  const userFromDb = await User.findById('6075dd17501426a1e563811e');

  req.user = new User(userFromDb);

  next();
};
