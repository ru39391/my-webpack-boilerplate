const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //генерация html
const TerserPlugin = require('terser-webpack-plugin'); //минификация JS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); //минификация CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //извлечение cтилей из JS
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin'); //генерация svg-спрайта

const entries = {};
const pathways = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
};

const { src, dist }  = pathways;

function getSourcesArr(pathway, foldername, ext, extReplaced = '') {
  const folder = `${pathway}/${foldername}/`;
  const filesArr = fs.readdirSync(folder).filter(item => path.extname(item) === `.${ext}`);
  const regex = new RegExp(`.${ext}`);
  return filesArr.map((item) => {
    return {
      pathway: `${folder}${item}`,
      filename: item.replace(regex, `.${extReplaced}`),
      regex
    };
  });
}

getSourcesArr(src, 'js', 'js').forEach((item) => {
  const { pathway, filename } = item;
  entries[filename.replace(/\./, '')] = pathway;
});

module.exports = {
  entry: entries,
  output: {
    path: dist,
    clean: true,
    filename: 'js/[name].bundle.js',
    assetModuleFilename: '[name][ext]',
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
          use: {
            loader: 'pug-loader',
            options: { pretty: true }
          }
        },
        {
          test: /\.(s*)css$/,
          use: [
            MiniCssExtractPlugin.loader,
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
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.svg$/,
          use: [
            { loader: 'svg-sprite-loader', options: {
                extract: true,
                //publicPath: '/',
                //spriteFilename: './img/icons/icons.svg'
                publicPath: '../img/icons/',
                spriteFilename: 'icons.svg'
              }
            }
          ]
        },
      ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
    }),
    ...getSourcesArr(src, 'views', 'pug', 'html').map((item) => new HtmlWebpackPlugin({
      template: item.pathway,
      filename: item.filename,
      favicon: `${src}/img/favicon.ico`,
      minify: false,
    })),
    new SpriteLoaderPlugin({
      plainSprite: true
    })
  ]
};
