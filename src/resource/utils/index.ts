Function.prototype.call = function(context: any) {
  const fn = +new Date()
  context = context ? Object(context) : window
  const args = [...Array.from(arguments)].slice(1)
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}

Function.prototype.apply = function(context: any, arr: any[]) {
  let result
  const fn = +new Date()
  context = context ? Object(context) : window
  context[fn] = this
  if (arr && arr.length > 0) {
    result = context[fn](...arr)
  } else {
    result = context[fn]()
  }
  delete context[fn]
  return result
}

Function.prototype.bind = function(context: any) {
  context = context ? Object(context) : window
  const self = this
  const args = [...Array.from(arguments)].slice(1)

  return function() {
    const endArgs = args.concat([...Array.from(arguments)])
    self.apply(context, endArgs)
  }
}
