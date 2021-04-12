const { Model, STRING } = require('sequelize');

const sequelize = require('../utils/database');

class CartItem extends Model {}

CartItem.init(
  {
    id: { type: STRING, autoIncrement: true, allowNull: false, primaryKey: true },
  },
  { sequelize, modelName: 'cartItem' },
);

module.exports = CartItem;
