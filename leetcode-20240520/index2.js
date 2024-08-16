  function newFn(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  if (typeof result === 'object' || typeof result === 'function') return result
  return obj
}

function myInstanceof(left, right) {
  while (true) {
    if (left === null) return false
    if (left.__proto__ === right.prototype) {
      return true
    }
    left = left.__proto__
  }
}

class eventEmitter {
  constructor() {
    this.events = new Map()
  }

  on(type, callback) {
    let cbs = this.events.get(type)
    this.events.set(type, cbs ? [...cbs, callback] : [callback])
  }

  off(type, callback) {
    const cbs = this.events.get(type)
    if (!cbs || !cbs.length) return
    this.events.set(type, cbs.filter(cb => cb !== callback))
  }

  emit(type) {
    const cbs = this.events.get(type)
    if (!cbs || !cbs.length) return
    cbs.forEach(cb => {
      if (cb && typeof cb === 'function') cb()
    })
  }
}

function flatten(array) {
  const newArr = []

  function flat(arr) {
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        flat(item)
      } else {
        newArr.push(item)
      }
    })
  }

  flat(array)
  return newArr
}

function flatten1(array) {
  return array.reduce((prev, cur) => {
    return !Array.isArray(cur) ? [...prev, cur] : [...prev, ...flatten1(cur)]
  }, [])
}

function newFn(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.call(obj, ...args)
  return (typeof result === 'function' || typeof result === 'object') ? result : obj
}

Function.prototype.myCall = function(context, ...args) {
  if (!context) {
    context = window
  }
  const key = new Symbol()
  context[key] = this
  context[key](...args)
}

Function.prototype.myApply = function(context, ...args) {
  if (!context) {
    context = window
  }
  const key = new Symbol()
  context[key] = this
  context[key](args)
}

Function.prototype.myBind = function(context, ...args) {
  if(!context) {
    context = window
  }

  const key = new Symbol()
  context[key] = this
  const _this = this

  const result = function(...extraArgs) {
    if (this instanceof _this) {
      this[key] = context[key]
      this[key](...[...args, ...extraArgs])
    } else {
      context[key](...[...args, ...extraArgs])
    }
  }

  result.prototype = Object.create(_this.prototype)

  return result
}

function deepClone(target, hashmap = new Map()) {

  if (hashmap.has(target)) return hashmap.get(target)

  const result = Array.isArray(target) ? [] : {}
  hashmap.set(target, result)

  Object.keys(target).forEach((key) => {
    const value = target[key]

    if (typeof value == 'object' && value !== null) {
      result[key] = deepClone(value, hashmap)
    } else {
      result[key] = value
    }
  })

  return result
}

function myInstanceof(left, right) {
  while (true) {
    if (left === null) return false
    if (left === right.prototype) return true
    left = left.__proto__
  }
}

function curry(fn, ...args) {
  let allArgs = [...args]
  const innerFn = function(...innerArgs) {
    allArgs = [...allArgs, ...innerArgs]
    if (allArgs.length === fn.length) {
      return fn(...allArgs)
    }
    return innerFn
  }

  return innerFn
}

function debounce(fn, delay) {
  let timer = null

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

function throttle(fn, delay) {
  let canRun = true
  return function(...args) {
    if (!canRun) return
    canRun = false
    let timer = null
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
      timer = null
      canRun = true
    }, delay)
  }
}

function all(promises) {
  if (!promises ||! promises.length) return Promise.resolve()
  let result = []
  return new Promise((resolve, reject) => {
    for (let index = 0; index < promises.length; index ++) {
      const promise = promises[index]
      Promise.resolve(promise).then(res => {
        result.push(res)

        if (index === promises.length - 1) {
          resolve(result)
        }   
      }).catch(reject) 
    }  
  })
}