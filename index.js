var express = require('express'),
    path = require('path'),
    proxy = require('express-http-proxy'),
    url = require('url'),
    util = require('util');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Proxy to CouchDB
var proxyMiddleware = proxy('localhost:5984', {
});
var proxyPathsRegex = /^\/_[a-zA-Z]+|\/notes-db/;
app.use(function(req, res, next) {
  var path = url.parse(req.url).path;
  if (proxyPathsRegex.test(path)) {
    proxyMiddleware(req, res, next);
  } else {
    next();
  }
});

var port = process.env.PORT || 3124;
app.listen(port, function() {
  util.log(`Listening on port ${port}`);
});

