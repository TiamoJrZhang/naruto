//iterator迭代器
function createIterator(items) {
  let i = 0
  return {
    next: function() {
      const done = i >= items.length
      const value = items[i]

      return {
        done,
        value,
      }
    },

    [Symbol.iterator]: function() {
      return this
    },
  }
}

//自执行器
function bar() {
  return Promise.resolve(1)
}

function bar2() {
  return Promise.resolve(2)
}

//yield 返回Prromies自执行形式
export function run(gen) {
  return new Promise(function(resolve, reject) {
    const g = gen()

    function runNext(value) {
      let result
      try {
        result = g.next(value)
      } catch (error) {
        g.throw(error)
      }
      if (result.done) return resolve(result.value)
      Promise.resolve(result.value).then(
        function(value) {
          runNext(value)
        },
        function(err) {
          g.throw(err)
        },
      )
    }

    runNext()
  })
}

/**
 * yield 返回thunk函数自执行形式
 * thunk 函数是指: 1.有且只有一个参数是callback的函数；2.callback的第一个参数是error
 * 如方法readfile返回的函数即为一个thunk函数
 */

// function readFile(filename) {
//   return function(callback) {
//     require('fs').readFile(filename, 'utf-8', callback)
//   }
// }

/**
 * thunkfiy函数，用于生成thunk函数
 */
export function thunkfiy(fn) {
  if (typeof fn !== 'function') throw new Error('function required')
  return function() {
    const args = Array.prototype.slice.call(arguments)
    const ctx = this
    return function(cb) {
      let called = false
      args.push(function() {
        if (called) return
        called = true
        cb.apply(null, arguments)
      })
      try {
        fn.apply(ctx, args)
      } catch (error) {
        cb(error)
      }
    }
  }
}

export function co(gen) {
  return function(fn) {
    const g = gen()

    function next(err, result) {
      if (err) {
        fn(err, result)
        return
      }
      const step = g.next(result)
      !step.done ? step.value(next) : fn(null, result)
    }
    next()
  }
}

//pormise自执行示例
export function* foo() {
  const res = yield bar()
  console.log('res..', res)
  const res2 = yield bar2(res)
  console.log('res2..', res2)
}

//thunk函数自执行示例
//wrap the function to thunk
//辅助传参，yield真正使用的是其返回的thunk函数
function readFile(filename) {
  return function(callback) {
    require('fs').readFile(filename, 'utf8', callback)
  }
}

co(function*() {
  var file1 = yield readFile('./file/a.txt')
  var file2 = yield readFile('./file/b.txt')

  console.log(file1)
  console.log(file2)
  return 'done'
})(function(err, result) {
  console.log(err, result)
})
