/** @format */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const paths = require('./paths')

module.exports = {
  entry: {
    app: './src/index',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': paths.appSrc,
      react: 'anujs',
      'react-dom': 'anujs',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts|tsx|js?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        include: [paths.appSrc, paths.appIndex, ...paths.antdSrc],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
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
