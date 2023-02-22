const fs = require('fs')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //генерация html
const TerserPlugin = require('terser-webpack-plugin'); //минификация JS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); //минификация CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //извлечение cтилей из JS
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin'); //генерация svg-спрайта

const paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};
const pagesDir = `${paths.src}/views/`;
const pages = fs.readdirSync(pagesDir).filter(item => path.extname(item) === '.pug');

console.log(pages.map((item) => {
  return {
    template: `${pagesDir}${item}`,
    filename: `./${item.replace(/\.pug/,'.html')}`,
    tpl: path.join(__dirname, 'src/views/', item),
    filename: `${item.replace(/\.pug/,'.html')}`,
  }
}));

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/js/main.js'),
    //icons: path.resolve(__dirname, 'src/js/icons.js')
  },
  output: {
    path: `${paths.dist}`,
    filename: 'js/[name].bundle.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
      rules: [
        {
          test: /\.pug$/,
          loader: 'pug-loader',
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            { loader: 'css-loader', options: { importLoaders: 1 } },
            { loader: 'postcss-loader', options: {
              postcssOptions: {
                plugins: {
                  'postcss-preset-env': {
                    browsers: 'last 2 versions',
                    stage: 0,
                  }
                }
              }
            }},
            'sass-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../fonts'
            }
          }
        },
        {
          test: /\.svg$/,
          use: [
            { loader: 'svg-sprite-loader', options: {
                extract: true,
                //publicPath: '/',
                //spriteFilename: './img/icons/icons.svg'
                publicPath: 'img/icons/',
                spriteFilename: 'icons.svg'
              }
            }
          ]
        },
      ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    ...pages.map(page => new HtmlWebpackPlugin({
      template: `${pagesDir}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`,
      //favicon: `${paths.src}/img/favicon.ico`,
      minify: false,
    })),
    new SpriteLoaderPlugin({
      plainSprite: true
    })
  ]
};
