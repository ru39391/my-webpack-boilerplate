const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
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
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    open: true,
    hot: true,
    port: 3000
  }
});
