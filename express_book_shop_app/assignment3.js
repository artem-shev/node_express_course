const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.route('/users').get((req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'a3.users.html'));
});

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'a3.main.html'));
});

app.listen(3000);
