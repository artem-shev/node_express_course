const Product = require('./product');
const User = require('./user');
const Cart = require('./cart');
const CartItem = require('./cart-item');
const Order = require('./order');
const OrderItem = require('./order-item');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
