const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local'),
});
console.log('path.resolve', path.resolve(process.cwd(), 'express_app', '.env.local'));
console.log('process.env', process.env);

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: process.env.MYSQL_PSW,
});

module.exports = pool.promise();
