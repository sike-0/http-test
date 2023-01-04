var http = require('http');

http.createServer(function (req, res) {
    res.write("\u001b[40m A \u001b[41m B \u001b[42m C \u001b[43m D \u001b[0m");
    res.end();
}).listen(process.env.PORT);
