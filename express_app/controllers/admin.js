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
  const { title, description, price, imageUrl } = req.body;

  await req.user.createProduct({
    title,
    description,
    price,
    imageUrl: imageUrl || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
  });

  res.redirect('/');
};

module.exports.getProducts = (req, res) => {
  req.user.getProducts().then((products) => {
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

  Product.findByPk(productId).then((product) => {
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
  const { title, description, price, imageUrl, productId: id } = req.body;

  const product = await Product.findByPk(id);

  Object.assign(product, { title, imageUrl, description, price });

  await product.save();

  res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;

  await Product.destroy({ where: { id: productId } });

  res.redirect('/admin/products');
};
