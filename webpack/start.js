/** @format */

const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const args = process.argv.slice(2)

const config = require('./webpack.dev.js')
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  open: '',
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  }
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)

server.listen(args[0] || 5000, 'localhost', () => {
  console.log('i am running')
})
