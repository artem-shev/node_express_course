const fs = require('fs');

const requestHandler = (req, res) => {
  const { url, method } = req;
  res.setHeader('Content-Type', 'text/html');

  if (url === '/') {
    res.write(`
      <html>
          <head>
              <title>first page</title>
          </head>
          <body>
              <form action="/message" method="POST">
                  <input name="message" type="text" />
                  <button type="submit">submit</button>
              </form>
          </body>
      </html> 
    `);

    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log('chunk', chunk);
      body.push(chunk);
    });
    return req.on('end', (...args) => {
      console.log('args', args);
      const parsedBody = Buffer.concat(body).toString();
      const [, message] = parsedBody.split('=');

      fs.writeFile('message.txt', message, () => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.write(`
    <html>
        <head>
            <title>first page</title>
        </head>
        <body>
            <h1>hello world!</h1>
        </body>
    </html>
  `);

  res.end();
};

// module.exports = requestHandler;
module.exports = { requestHandler };
// module.exports.requestHandler = requestHandler;
