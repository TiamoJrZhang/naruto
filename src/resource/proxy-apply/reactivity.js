//proxy在vue响应式原理中的应用

let currentEffect = null

class Dep {
  constructor(val) {
    this.effects = new Set()
    this._val = val
  }

  get value() {
    this.depend()
    return this._val
  }

  set value(newVal) {
    this._val = newVal
    this.notify()
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }

  notify() {
    this.effects.forEach(effect => effect())
  }
}

function effectWatch(effect) {
  currentEffect = effect
  effect()
  currentEffect = null
}

// //针对值变更类似与ref
// var a = new Dep(10)

// let b

// effectWatch(() => {
//   b = a.value + 10
//   // console.log('b...', b)
// })

// a.value = 20

//一个对象对应多个key值，一个key值对应一个依赖
const targetMap = new Map()

function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

const proxyMap = new Map()

//响应式对象
function reactive(raw) {
  if (proxyMap.has(raw)) return proxyMap.get(raw)

  const proxyTarget = new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key)
      //依赖收集
      dep.depend()

      const result = Reflect.get(target, key)
      if (typeof result === 'object' && result !== null) {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key)
        if (!descriptor || (!descriptor.writable === false && !descriptor.configurable === false)) {
          return reactive(result)
        }
      }

      return result
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      const dep = getDep(target, key)
      //依赖收集
      dep.notify()
      return result
    },
  })

  if (!proxyMap.has(raw)) {
    proxyMap.set(raw, proxyTarget)
  }

  return proxyTarget
}

var a = reactive({
  name: 'jieren',
  age: '20',
  b: {
    name: 'jack',
    age: '30',
  },
})

effectWatch(() => {
  console.log('name..', a.b.name)
})

// effectWatch(() => {
//   console.log('age..', a.age)
// })

//此时触发set会导致.b触发get，因此需要将.b对应的proxy存起来
a.b.name = 'shouning'
// a.age = 18
