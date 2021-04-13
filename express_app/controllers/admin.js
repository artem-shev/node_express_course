const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(ROOT_DIR, 'views', 'add-product.html'));
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

module.exports.postAddProduct = async (req, res, next) => {
  const userId = req.user._id;
  const { title, description, price, imageUrl } = req.body;

  await new Product({ title, description, price, imageUrl, userId }).save();

  res.redirect('/');
};

module.exports.getProducts = (req, res) => {
  Product.fetchAll().then((products) => {
    // res.sendFile(path.join(ROOT_DIR, 'views', 'shop.html'));
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
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
    });
  });
};

exports.postEditProduct = async (req, res, next) => {
  const userId = req.user._id;
  const { title, description, price, imageUrl, productId: id } = req.body;

  await new Product({ id, price, imageUrl, description, title, userId }).save();

  res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  await Product.deleteById(productId);

  res.redirect('/admin/products');
};
