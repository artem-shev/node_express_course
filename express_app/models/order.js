const { makeModel } = require('../utils/database');

class Order extends makeModel('orders') {}

module.exports = Order;
