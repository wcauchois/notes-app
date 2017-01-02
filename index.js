var express = require('express'),
    path = require('path'),
    proxy = require('express-http-proxy'),
    url = require('url'),
    morgan = require('morgan'),
    util = require('util');

var app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Proxy to CouchDB
var couchDbPort = 5984;
var proxyMiddleware = proxy('localhost:' + couchDbPort, {
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

