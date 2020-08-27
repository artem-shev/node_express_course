// or server.js
const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.requestHandler);

// default port 80
server.listen(3000);
