const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const src = path.join(__dirname, '../src');

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: '/',
    assetModuleFilename: '[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: src,
    },
    watchFiles: src,
    open: true,
    hot: true,
    port: 3000
  }
});
