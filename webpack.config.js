const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

let isDev = process.env.NODE_ENV === 'development';
console.log('IS DEV: ', isDev)

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
  devServer: {
    port: 3100,
    liveReload: true,
    open: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['main']
    }), 
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(
      {
        filename: `[name].css`,
        attributes: {
          id: 'main_theme'
        }
      }
    ),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: {
              exposes: ['$', 'jquery']
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['file-loader?name=[name].css',
          'sass-loader'],
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img'
            }
          }
        ]
      },
    ]
  }
}