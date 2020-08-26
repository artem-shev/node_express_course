const chalk = require('chalk');
const { getNotes } = require('./notes');

console.log(getNotes());
console.log('chalk.green', chalk.green.bgWhite.bold.inverse('Success'));
