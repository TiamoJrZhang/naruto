//new实现
export function fakeNew() {
  const args = Array.prototype.slice.call(arguments)
  const [ctor, ...arugs] = [...args]
  const context = Object.create(ctor.prototype)
  const result = ctor.apply(context, arugs)
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result
  }
  return context
}

//call实现
Function.prototype.call = function(context) {
  context = context ? Object(context) : window
  const args = Array.from(arguments).slice(1)
  context.func = this
  const result = context.func(...args)
  delete context.func
  return result
}

//apply实现
Function.prototype.apply = function(context, arr) {
  context = context ? Object(context) : window
  const args = Array.from(arguments).slice(1)
  context.func = this
  let result
  if (arr && arr.length >= 0) {
    result = context.func(...args)
  } else {
    result = context.func()
  }
  delete context.func
  return result
}

// Object.create = function(proto) {
//   function F() {}
//   F.prototype = proto
//   return new F()
// }

Function.prototype.bind = function(context) {
  const fn = this
  if (!fn || typeof fn === 'function') return
  const args = Array.prototype.slice.call(arguments, 1)
  const Bound = function() {
    const argus = Array.prototype.slice.call(arguments)
    return fn.apply(this instanceof Bound ? this : context, argus.concat(args))
  }

  Bound.prototype = Object.create(fn.prototype, {
    constructor: {
      value: Bound,
    },
  })
}

//柯里化
function sum(a, b, c) {
  return a + b + c
}

function curry(fn, ...args) {
  if (args.length < fn.length) {
    return (...argument) => curry(fn, ...argument, ...args)
  }
  if (args.length === fn.length) {
    return fn(...args)
  }
  return false
}

curry(sum)(1)(2)(3)

//jsonp
function Jsonp(url, params = {}, callback) {
  return new Promise(function(resolve, reject) {
    const script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }

    let arr = []
    const params = {...params, callback}
    if (typeof params === 'object') {
      Object.keys(params).forEach(function(key) {
        arr.push(`${key}=${params[key]}`)
      })
    }
    const paramsStr = params.join('&')
    script.src = url + '?' + paramsStr
    document.body.appendChild(script)
  })
}

//jsonp服务端伪代码
app.get('/show', function(req, res) {
  let {callback} = req.query
  res.send(`${callback}('hello!')`)
})

//防抖
function debounce(fn, wait) {
  let timeId = null,
    result

  const later = function(context, params) {
    return setTimeout(function() {
      result = fn.apply(context, params)
    }, wait)
  }

  const debounced = function() {
    if (timeId) {
      clearTimeout(timeId)
      timeId = null
    }
    timeId = later(this, arguments)
  }

  return debounced
}

//节流 leading忽略第一次 trailing忽略最后一次
function throttle(fn, wait, option = {}) {
  let pervious = 0,
    result,
    timeId = null

  const later = function(context, params, remaining) {
    return setTimeout(() => {
      //setTimeout里执行的是最后一次，所以下一次开始时如果设置了option.leading === false，perviou需要设置为0
      pervious = option.leading === false ? 0 : +new Date()
      timeId = null
      result = fn.apply(context, params)
      console.log('i am running2')
      // if (!timeId) context = args = null
    }, remaining)
  }

  const throttled = function(...args) {
    const now = +new Date()
    if (pervious === 0 && option.leading === false) {
      pervious = now
    }
    //快速滚动的情况下不会进入这里
    const remaining = wait - (now - pervious)
    if (remaining <= 0 || remaining > wait) {
      if (timeId) {
        clearTimeout(timeId)
        timeId = null
      }
      pervious = now
      console.log('i am running')
      result = fn.apply(this, args)
      // if (!timeId) context = args = null;
    }
    if (!timeId && option.trailing !== false) {
      timeId = later(this, args, remaining)
    }

    return result
  }

  return throttled
}

// const throttle = function(func, wait, options) {
//   var timeout, context, args, result;

//   // 上一次执行回调的时间戳
//   var previous = 0;

//   // 无传入参数时，初始化 options 为空对象
//   if (!options) options = {};

//   var later = function() {
//     // 当设置 { leading: false } 时
//     // 每次触发回调函数后设置 previous 为 0
//     // 不然为当前时间
//     previous = options.leading === false ? 0 : _.now();
//     console.log('i am running2')

//     // 防止内存泄漏，置为 null 便于后面根据 !timeout 设置新的 timeout
//     timeout = null;

//     // 执行函数
//     result = func.apply(context, args);
//     if (!timeout) context = args = null;
//   };

//   // 每次触发事件回调都执行这个函数
//   // 函数内判断是否执行 func
//   // func 才是我们业务层代码想要执行的函数
//   var throttled = function() {

//     // 记录当前时间
//     var now = _.now();

//     // 第一次执行时（此时 previous 为 0，之后为上一次时间戳）
//     // 并且设置了 { leading: false }（表示第一次回调不执行）
//     // 此时设置 previous 为当前值，表示刚执行过，本次就不执行了
//     if (!previous && options.leading === false) previous = now;

//     // 距离下次触发 func 还需要等待的时间
//     var remaining = wait - (now - previous);
//     context = this;
//     args = arguments;

//     // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
//     // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
//     // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
//     // 之后便会把 previous 值迅速置为 now
//     if (remaining <= 0 || remaining > wait) {
//       if (timeout) {
//         clearTimeout(timeout);

//         // clearTimeout(timeout) 并不会把 timeout 设为 null
//         // 手动设置，便于后续判断
//         timeout = null;
//       }

//       // 设置 previous 为当前时间
//       previous = now;
//       console.log('i am running')
//       // 执行 func 函数
//       result = func.apply(context, args);
//       if (!timeout) context = args = null;
//     } else if (!timeout && options.trailing !== false) {
//       // 最后一次需要触发的情况
//       // 如果已经存在一个定时器，则不会进入该 if 分支
//       // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
//       // 间隔 remaining milliseconds 后触发 later 方法
//       timeout = setTimeout(later, remaining);
//     }
//     return result;
//   };

//   // 手动取消
//   throttled.cancel = function() {
//     clearTimeout(timeout);
//     previous = 0;
//     timeout = context = args = null;
//   };

//   // 执行 _.throttle 返回 throttled 函数
//   return throttled;
// };

// const throttle = function(fn, wait) {
//   let pervious = 0

//   const throttled = function(...args) {
//     const now = +new Date()
//     if (wait <= now - pervious) {
//       fn.apply(this, args)
//       pervious = +new Date()
//     }
//   }

//   return throttled
// }

//promise all实现
Promise.all = function(promises) {
  return new Promise(function(resolve, reject) {
    const results = []
    promises.forEach(function(promise, index) {
      if (promise && typeof promise.then === 'function') {
        promise.then(function(data) {
          results.push(data)
        }, reject)
      } else {
        results.push(promise)
      }
      if (index == promises.length - 1) {
        resolve(results)
      }
    })
  })
}

//Promise.race
Promise.race = function(promises) {
  return new Promise(function(resolve, reject) {
    promises.forEach(function(promise) {
      if (promise && promise.then) {
        promise.then(resolve, reject)
      } else {
        resolve(promise)
      }
    })
  })
}

//实现flatDeep
const flatDeep = function(arr) {
  return arr.flat(Math.pow(2, 53) - 1)
}

const flatDeep1 = function(arr) {
  if (!Array.isArray(arr)) return
  return arr.reduce(function(end, item) {
    return Array.isArray(item) ? end.concat(flatDeep1(item)) : end.concat(item)
  }, [])
}

const flatDeep2 = function(arr) {
  if (!Array.isArray(arr)) return
  let stack = [...arr]
  let result = []

  while (stack.length > 0) {
    const curItem = stack.shift()
    if (Array.isArray(curItem)) {
      stack = [...stack, ...curItem]
    } else {
      result.push(curItem)
    }
  }

  return result
}

//数组去重
function unique(arr) {
  return Array.from(new Set(arr))
}

function unique1(arr) {
  return arr.filter(function(item, index) {
    return arr.indexOf(item) === index
  })
}

function unique3(arr) {
  var result = []
  arr.forEach(function(item) {
    if (!result.includes(item)) {
      result.push(item)
    }
  })
  return result
}

function unique4(arr) {
  return arr.reduce(function(pre, cur) {
    if (!pre.includes(cur)) {
      pre = [...pre, cur]
    }
    return pre
  }, [])
}

//编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
function operation(arr) {
  return Array.from(
    new Set(
      arr.flat(5).sort(function(a, b) {
        return a - b
      }),
    ),
  )
}
