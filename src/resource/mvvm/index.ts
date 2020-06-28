
function isPlainObject(obj: any) {
  if (obj === null || typeof obj !== 'object') return false
  
  return Object.getPrototypeOf(obj) === Object.prototype
}

function Mvvm(options={}) {
  this.$options = options
  let data = this._data = this.$options.data

  //数据劫持
  observe(data)

  //this代理this._data
  Object.keys(data).forEach(function(key) {
    Object.defineProperty(this, key, {
      configurable: true, 
      get() {
        return this._data[key]
      },
      set(newVal) {
        this._data[key] = newVal
      }
    })
  })
}

function observe(data: any) {
  if (!isPlainObject(data)) return data
  return observeLoop(data) 
}

function observeLoop(data: any) {
  Object.keys(data).forEach(function(key) {
    let val = data[key]
    observe(val)
    Object.defineProperty(data, key, {
      configurable: true,
      get() {
        return val
      },
      set(newVal) {
        if (val === newVal) return
        val = newVal
        observe(val)
      }
    })
  })
}

//发布订阅
class Deps {
  subs: Function[]
  constructor() {
    this.subs = []
  }

  addSub(sub: any) {
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach((fn: any) => fn.update())
  }
}

class Watcher  {
  fn: Function
  constructor(fn: Function) {
    this.fn = fn
  }

  update() {
    this.fn()
  }
}

