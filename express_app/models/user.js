const { Model, INTEGER, STRING } = require('sequelize');

const sequelize = require('../utils/database');

class User extends Model {}

User.init(
  {
    id: { type: INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    email: STRING,
    name: STRING,
  },
  { sequelize, modelName: 'user' },
);

module.exports = User;
