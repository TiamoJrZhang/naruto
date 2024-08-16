const http = require('http');
const fs = require('fs');
const etag = require('etag');

const server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTION, PUT, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.url === '/test') {
    fs.readFile("./test.html", function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    });
  }

  if (req.url === '/cc') {
    const payload = {
      a: 11112222,
      c: 222
    };
    if (etag(JSON.stringify(payload)) === req.headers["if-none-match"]) {
      res.statusCode = 304;
      res.end(JSON.stringify(payload));
    } else {
      res.setHeader('ETag', etag(JSON.stringify(payload)))
      res.end(JSON.stringify(payload))
    }
  }
});

server.listen(3000); 

console.log('Node.js web server running at port 3000')