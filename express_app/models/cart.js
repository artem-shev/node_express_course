const { Model, STRING } = require('sequelize');

const sequelize = require('../utils/database');

class Cart extends Model {}

Cart.init(
  {
    id: { type: STRING, autoIncrement: true, allowNull: false, primaryKey: true },
  },
  { sequelize, modelName: 'cart' },
);

module.exports = Cart;
