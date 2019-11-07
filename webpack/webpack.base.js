const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const paths = require('./paths')

module.exports = {
  entry: {
    app: './app/index.js' 
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js|jsx|tsx$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{
          options: {
            
          },
          loader: 'eslint-loader',
        }, {
          loader: 'babel-loader',
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '专用测试App',
      inject: true,
      template: paths.appHtml,
    }),
  ]
}