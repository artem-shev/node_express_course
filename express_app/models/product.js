const { Model, INTEGER, STRING, DOUBLE } = require('sequelize');

const sequelize = require('../utils/database');

// const Product = sequelize.define('product', {
//   id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
//   title: Sequelize.STRING,
//   price: { type: Sequelize.DOUBLE, allowNull: false },
//   imageUrl: { type: Sequelize.STRING, allowNull: false },
//   description: { type: Sequelize.STRING, allowNull: false },
// });

class Product extends Model {}

Product.init(
  {
    id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    title: STRING,
    price: { type: DOUBLE, allowNull: false },
    imageUrl: { type: STRING, allowNull: false },
    description: { type: STRING, allowNull: false },
  },
  { sequelize, modelName: 'product' },
);

module.exports = Product;
