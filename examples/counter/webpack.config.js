var path = require('path');
var projectRoot = path.join(__dirname, '..', '..');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname
    }]
  },
  resolve: {
    alias: {
      'rx': 'rx-lite'
    }
  }
};

// When inside Redux repo, prefer src to compiled version.
// You can safely delete these lines in your project.
var src = path.join(projectRoot, 'src');
var nodeModules = path.join(projectRoot, 'node_modules');
var fs = require('fs');
if (fs.existsSync(src) && fs.existsSync(nodeModules)) {
  // Resolve Redux to source
  module.exports.resolve.alias['react-reactive-class'] = src;
  module.exports.resolve.alias.react = path.join(projectRoot, 'node_modules/react');
  module.exports.resolve.alias['react-dom'] = path.join(projectRoot, 'node_modules/react-dom');

  // Compile Redux from source
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    include: src
  });
}
