const webpack = require('webpack')
const config = require('./webpack.prod')

webpack(config, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return
  }
})
