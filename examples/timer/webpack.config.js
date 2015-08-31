'use strict';

module.exports = {
  entry: [
    './index.js',
    '../../src/index.js'
  ],
  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/}
    ]
  },
  resolve: {
    alias: {
      'react-reactive-class': '../../src/index'
    },
    extensions: ['', '.js']
  }
};
