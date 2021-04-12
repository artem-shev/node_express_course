const Product = require('./product');
const User = require('./user');
const Cart = require('./cart');
const CartItem = require('./cart-item');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Product);
User.hasOne(Cart);

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
