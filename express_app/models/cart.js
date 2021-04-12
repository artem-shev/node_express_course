const { Model, INTEGER } = require('sequelize');

const sequelize = require('../utils/database');

class Cart extends Model {}

Cart.init(
  {
    id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
  },
  { sequelize, modelName: 'cart' },
);

module.exports = Cart;
