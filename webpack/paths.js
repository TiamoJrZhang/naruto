/** @format */

'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  appHtml: resolveApp('public/index.html'),
  appSrc: resolveApp('src'),
  appIndex: resolveApp('index.tsx'),
  antdSrc: [resolveApp('node_modules/@ant-design/pro-layout/es'), resolveApp('node_modules/antd/es')],
}
