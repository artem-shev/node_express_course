const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local'),
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: process.env.MYSQL_PSW,
});

module.exports = pool.promise();
