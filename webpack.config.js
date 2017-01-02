var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/js/app.jsx',
    worker: './src/js/worker.js'
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: '[name].entry.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react']
      }
    }]
  }
};
