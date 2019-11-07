const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')

const config = require('./webpack.dev.js')
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  open: ''
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)

server.listen(5000, 'localhost', () => {
  console.log('i am running')
})