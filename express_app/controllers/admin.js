const Product = require('../models/product');
const { isAuthenticated } = require('../utils/auth');

module.exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(ROOT_DIR, 'views', 'add-product.html'));
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: isAuthenticated(req),
  });
};

module.exports.postAddProduct = async (req, res, next) => {
  let { title, description, price, imageUrl } = req.body;

  if (!title) title = 'book';
  if (!description) description = 'awesome book';
  if (!price) price = 42.99;
  if (!imageUrl) {
    imageUrl = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
  }

  await new Product({ title, description, price, imageUrl, userId: req.session.user }).save();

  res.redirect('/');
};

module.exports.getProducts = (req, res) => {
  Product.find().then((products) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: isAuthenticated(req),
    });
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
      path: '/admin/edit-product',
      editing: editMode,
      product,
      isAuthenticated: isAuthenticated(req),
    });
  });
};

exports.postEditProduct = async (req, res, next) => {
  const { title, description, price, imageUrl, productId } = req.body;

  await Product.findByIdAndUpdate(productId, { price, imageUrl, description, title });

  res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  await Product.findByIdAndDelete(productId);

  res.redirect('/admin/products');
};
