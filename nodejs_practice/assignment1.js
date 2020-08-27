const http = require('http');
const chalk = require('chalk');

const storage = {
  users: {
    1: 'John Doe',
  },
};

const makeHTML = (body) => `
  <html>
    <head>
        <title>assignment 1</title>
    </head>
    <body>${body}</body>
  </html>
`;

const server = http.createServer((req, res) => {
  const { url, method } = req;

  res.setHeader('Content-Type', 'text/html');

  switch (url) {
    case '/':
      res.write(
        makeHTML(`
          <h1>hello world!</h1>
          <div><a href="/users">users</a></div>
          <form method="post" action="/create-user">
            <input type="text" name="userName" />
            <button type="submit">submit</button>
          </form>
        `),
      );
      return res.end();
    case '/users':
      res.write(
        makeHTML(`
        <ul>
          ${Object.entries(storage.users)
            .map(([id, userName]) => `<li>${id}: ${userName}</li>`)
            .join('')}
        </ul>
      `),
      );
      return res.end();
    case '/create-user':
      if (method === 'POST') {
        const body = [];
        req.on('data', (chunk) => body.push(chunk));
        req.on('end', () => {
          const parsedBody = Buffer.concat(body).toString();
          const [, userName] = parsedBody.split('=');
          const id = Math.max(...Object.keys(storage.users).map(Number)) + 1;

          console.log(`new user ${chalk.black.bgGreen(userName)} was added successfully`);

          storage.users[id] = userName;
          res.statusCode = 302;
          res.setHeader('Location', '/users');

          return res.end();
        });
        break;
      }
    // fallthrough
    default:
      res.write(makeHTML('<h1>unhandled</h1>'));
      return res.end();
  }
});

server.listen(3000);
