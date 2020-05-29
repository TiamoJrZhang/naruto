// interface ThenPromise<T> {}

// interface ThenPromiseConstructor {
//   new <T>(executor: (reslove: (value?: any) => void, reject: (reason?: any) => void) => any): ThenPromise<T>
// }

const reslovePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    throw new Error('Chaining cycle detected for promise')
  }
  if (x && (typeof x == 'object' || typeof x == 'function')) {
    try {
      let then = x.then
      typeof then == 'function'
        ? then.call(
            x,
            value => {
              reslovePromise(promise2, value, resolve, reject)
            },
            err => {
              reject(err)
            },
          )
        : resolve(x)
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.resolveCallbacks = []
    this.rejectedCallbacks = []
    this.value = null
    this.error = null

    const resolve = value => {
      if (this.status == 'pending') {
        this.status = 'fullfilled'
        this.value = value
        if (this.resolveCallbacks.length > 0) {
          this.resolveCallbacks.forEach(fn => {
            if (fn) fn(value)
          })
        }
      }
    }
    const reject = error => {
      if (this.status == 'pending') {
        this.status = 'rejected'
        this.error = error
        if (this.rejectedCallbacks.length > 0) {
          this.rejectedCallbacks.forEach(fn => {
            if (fn) fn(error)
          })
        }
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  handleEvent = (promise2, reslove, reject, curEvent, value) => {
    try {
      let x = curEvent.call(this, value)
      reslovePromise(promise2, x, reslove, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new Promise((reslove, reject) => {
      if (this.status == 'fullfilled') {
        setTimeout(() => {
          this.handleEvent(promise2, reslove, reject, onFulfilled, this.value)
        })
      }

      if (this.status == 'rejected') {
        setTimeout(() => {
          this.handleEvent(promise2, reslove, reject, onRejected, this.error)
        })
      }

      if (this.status == 'pending') {
        this.resolveCallbacks.push(() => {
          setTimeout(() => {
            this.handleEvent(promise2, reslove, reject, onFulfilled, this.value)
          })
        })
        this.rejectedCallbacks.push(() => {
          setTimeout(() => {
            this.handleEvent(promise2, reslove, reject, onRejected, this.error)
          })
        })
      }
    })
    return promise2
  }

  catch(fn) {
    this.then(() => {}, fn)
  }

  done(onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected).catch(err => {
      throw new Error(err)
    })
  }

  finally(callback) {
    const P = this.constructor
    if (typeof callback == 'function') {
      this.then(callback, callback)
    }
    return this.then(
      value => P.reslove(callback()).then(() => value),
      error => P.reslove(callback()).then(() => error),
    )
  }
}

MyPromise.reslove = value => {
  if (value instanceof MyPromise) return value
  return new MyPromise((resolve, reject) => {
    resolve(value)
  })
}

MyPromise.reject = value => {
  return new MyPromise((resolve, reject) => {
    reject(value)
  })
}

MyPromise.race = promises => {
  return new MyPromise((reslove, reject) => {
    promises.forEach(promise => {
      promise.then(reslove, reject)
    })
  })
}

MyPromise.all = promises => {
  const dataArr = []
  return new MyPromise((reslove, reject) => {
    promises.forEach((v, index) => {
      if (v && typeof v.then == 'function') {
        v.then(value => {
          dataArr.push(value)
        }, reject)
      } else {
        dataArr.push(v)
      }
      if (index == promises.length - 1) {
        reslove(dataArr)
      }
    })
  })
}

export default MyPromise
