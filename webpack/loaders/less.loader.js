const less = require('less')
const pify = require('pify')
const loaderUtils = require('loader-utils')

const render = pify(less.render.bind(less))
const matchSourceMappingUrl = /\/\*# sourceMappingURL=[^*]+\*\//

function removeSourceMappingUrl(content) {
  return content.replace(matchSourceMappingUrl, '')
}

function processResult(loaderContext, resultPromise) {
  const {callback} = loaderContext
  resultPromise
    .then(
      ({css, map, imports}) => {
        imports.forEach(loaderContext.addDependency, loaderContext)
        return {
          css: removeSourceMappingUrl(css),
          map: typeof map === 'string' ? JSON.parse(map) : map,
        }
      },
      lessError => {
        if (lessError.filename) {
          loaderContext.addDependency(lessError.filename)
        }

        throw new Error(lessError)
      },
    )
    .then(({css, map}) => {
      callback(null, css, map)
    }, callback)
}

module.exports = function(source) {
  const loaderContext = this
  const options = loaderUtils.getOptions(loaderContext)
  loaderContext.async()
  processResult(loaderContext, render(source, options))
}
