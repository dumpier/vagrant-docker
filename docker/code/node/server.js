const http = require("http");
const html = require('fs').readFileSync('views/index.html');

const server = http.createServer(function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(html);
});

server.listen(3000);