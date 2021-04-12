const { Model, INTEGER } = require('sequelize');

const sequelize = require('../utils/database');

class CartItem extends Model {}

CartItem.init(
  {
    id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    quantity: INTEGER,
  },
  { sequelize, modelName: 'cartItem' },
);

module.exports = CartItem;
