/** @format */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const paths = require('./paths')

module.exports = {
  entry: {
    app: './index',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.ts|tsx?$/,
      use:  [{
        loader: 'babel-loader',
      }, {
        loader: 'ts-loader'
      }],
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '专用测试App',
      inject: true,
      template: paths.appHtml,
    }),
  ],
}
