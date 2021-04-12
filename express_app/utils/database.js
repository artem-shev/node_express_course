// const mysql = require('mysql2');
const path = require('path');
const Sequelize = require('sequelize');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local'),
});

// @ts-ignore
const sequelize = new Sequelize('node-complete', 'root', process.env.MYSQL_PSW, {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: process.env.MYSQL_PSW,
// });
//
// module.exports = pool.promise();
