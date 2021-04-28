const { validationResult, body } = require('express-validator/check');
const faker = require('faker');

const Product = require('../models/product');
const getPaginationData = require('../utils/pagination');
const { deleteFile } = require('../utils/file');

module.exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(ROOT_DIR, 'views', 'add-product.html'));
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
  });
};

module.exports.validatePostProduct = [
  body('title').trim().isString().isLength({ min: 3 }),
  body('imageUrl').trim().isURL(),
  body('price').trim().isFloat(),
  body('description').trim().isLength({ min: 5, max: 200 }),
];

module.exports.postAddProduct = async (req, res, next) => {
  let { title, description, price, imageUrl } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const descriptor = {
      hasError: true,
      fieldsWithErrors: errors.array().reduce((acc, { msg, param }) => {
        acc[param] = msg;
        return acc;
      }, {}),
    };
    console.warn('invalid product input', errors.array());
  }

  if (!title) {
    const books = await Product.find();
    title = `book #${books.length + 1}`;
  }
  if (!description) description = faker.lorem.sentences(2);
  if (!price) price = faker.commerce.price();
  if (image) {
    imageUrl = `/${image.path}`;
  }
  if (!imageUrl) {
    imageUrl = faker.image.imageUrl(250, 350, 'books', true);
    // imageUrl = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
  }

  await new Product({ title, description, price, imageUrl, userId: req.session.user }).save();

  res.redirect('/admin/products');
};

module.exports.getProducts = async (req, res, next) => {
  // return next(new Error('test'));
  const total = await Product.countDocuments({ userId: req.user._id });
  const { skip, limit, ...pagePaginationData } = getPaginationData(req, total);

  const products = await Product.find({ userId: req.user._id }).skip(skip).limit(limit);

  // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    ...pagePaginationData,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const { productId } = req.params;

  Product.findById(productId).then((product) => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = async (req, res, next) => {
  let { title, description, price, imageUrl, productId } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.warn('invalid product input');
  }

  const product = await Product.findOne({ _id: productId, userId: req.user._id });

  if (!product) return res.redirect('/');

  if (image) {
    if (image[0] === '/') {
      deleteFile(imageUrl.slice(1));
    }
    imageUrl = `/${image.path}`;
  }

  Object.assign(product, { price, imageUrl, description, title });

  await product.save();

  res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  const { imageUrl } = await Product.findById(productId);
  await Product.deleteOne({
    _id: productId,
    userId: req.user._id,
  });

  if (imageUrl[0] === '/') {
    deleteFile(imageUrl.slice(1));
  }

  res.redirect('/admin/products');
};
