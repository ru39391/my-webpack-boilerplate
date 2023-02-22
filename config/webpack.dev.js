const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: '/',
    assetModuleFilename: 'img/[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    watchFiles: path.join(__dirname, '../src'),
    open: true,
    hot: true,
    port: 3000
  }
});
