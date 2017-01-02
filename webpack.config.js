var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/js/app.js',
    worker: './src/js/worker.js'
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: '[name].entry.js'
  }
};
