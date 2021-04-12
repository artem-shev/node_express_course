const { Model, INTEGER } = require('sequelize');

const sequelize = require('../utils/database');

class Order extends Model {}

Order.init(
  {
    id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
  },
  { sequelize, modelName: 'order' },
);

module.exports = Order;
