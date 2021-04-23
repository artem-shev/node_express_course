const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/auth');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY;
const mailTransporter = nodemailer.createTransport(
  sendgridTransport({ auth: { api_key: SEND_GRID_API_KEY } }),
);

module.exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
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

  await mailTransporter.sendMail({
    to: email,
    from: 'nodecomplete@mailinator.com',
    subject: 'Signup Succeeded',
    message: 'Congrats, signup succeeded!',
    html: '<h1>Congrats, signup succeeded!</h1>',
  });

  return res.redirect('/login');
};

module.exports.getReset = (req, res) => {
  const errorMessage = req.flash('error');
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    errorMessage,
  });
};

module.exports.postReset = (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) res.redirect('/reset');

    const { email } = req.body;
    const token = buffer.toString('hex');

    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', `No account with ${email}`);
      return res.redirect('/reset');
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 60 * 24;

    await user.save();

    await mailTransporter.sendMail({
      to: email,
      from: 'nodecomplete@mailinator.com',
      subject: 'Password Reset',
      html: `
        <p>U requested password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}" target="_blank">link</a> to set a new password.</p>
      `,
    });

    res.redirect('/');
  });
};

module.exports.getNewPassword = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

  if (!user) {
    req.flash('error', 'No user found');
    return res.redirect('/login');
  }
  console.log('user._id', user._id);
  res.render('auth/new-password', {
    pageTitle: 'New Password',
    errorMessage: req.flash('error'),
    userId: user._id.toString(),
    token,
  });
};

module.exports.postNewPassword = async (req, res) => {
  const { userId, token, password } = req.body;
  const user = await User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  user.password = await bcrypt.hash(password, SALT_ROUNDS);
  user.resetToken = null;
  user.resetTokenExpiration = null;

  await user.save();

  res.redirect('/login');
};
