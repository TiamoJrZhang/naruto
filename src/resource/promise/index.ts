interface ThenPromise<T> {}

interface ThenPromiseConstructor {
  new <T>(executor: (reslove: (value?: any) => void, reject: (reason?: any) => void) => any): ThenPromise<T>
}

const resolvePromise = (promise2, x, resolve, reject) => {
  if (x === promise2) throw new Error('Chaining cycle detected for promise')
  if (x && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          value => {
            resolvePromise(promise2, value, resolve.reject)
          },
          reason => {
            reject(reason)
          },
        )
      } else {
        resolve(x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}

class MyPromise implements ThenPromiseConstructor {
  state: string
  value: any
  reason: any
  resolveCallbacks: any[]
  rejectCallbacks: any[]
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.resolveCallbacks = []
    this.rejectCallbacks = []
    const reslove = value => {
      if (this.state == 'pending') {
        this.state = 'fulfilled'
        this.value = value
        if (this.resolveCallbacks.length) {
          this.resolveCallbacks.forEach(fn => fn())
        }
      }
    }
    const reject = reason => {
      if (this.state == 'pending') {
        this.state = 'rejected'
        this.reason = reason
        if (this.rejectCallbacks.length) {
          this.rejectCallbacks.forEach(fn => fn())
        }
      }
    }

    try {
      executor(reslove, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.state == 'fulfilled') {
        let x = onFulfilled(this.value)
        resolvePromise(promise2, x, resolve, reject)
      }
      if (this.state == 'rejected') {
        let x = onRejected(this.reason)
        resolvePromise(promise2, x, resolve, reject)
      }
      if (this.state == 'pending') {
        this.resolveCallbacks.push(() => {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
        this.rejectCallbacks.push(() => {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        })
      }
    })
    return promise2
  }
}
