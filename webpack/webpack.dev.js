/** @format */

const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.base')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      react: path.resolve(process.cwd(), './react/react.development.js'),
      'react-dom': path.resolve(process.cwd(), './react/react-dom.development.js'),
    },
  },
})
