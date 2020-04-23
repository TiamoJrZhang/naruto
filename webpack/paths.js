/** @format */

'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  appHtml: resolveApp('public/index.html'),
  appSrc: resolveApp('src'),
  appIndex: resolveApp('index.tsx')
}
