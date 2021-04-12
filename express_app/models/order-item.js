const { Model, INTEGER } = require('sequelize');

const sequelize = require('../utils/database');

class OrderItem extends Model {}

OrderItem.init(
  {
    id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    quantity: INTEGER,
  },
  { sequelize, modelName: 'orderItem' },
);

module.exports = OrderItem;
