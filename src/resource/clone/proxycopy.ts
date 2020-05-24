const proxies = new Map()
const copies = new Map()
const MY_IMMER = 'MY_IMMER'

//如果是被代理过的对象value[MY_IMMER]会返回value，没有被代理过则是undefined
const isProxy = (value: any) => value && value[MY_IMMER]

const isPlainObject = function(obj: any) {
  if (typeof obj !== 'object' || obj === null) return false

  return Object.getPrototypeOf(obj) === Object.prototype
}

const getCopy = (target: any) => {
  if (copies.has(target)) return copies.get(target)
  const copy = Array.isArray(target) ? target.slice() : {...target}
  copies.set(target, copy)
  return copy
}

// const objectTraps: ProxyHandler<object | Array<any>> = {
//   get(target: any, key: string): any {
//     if (key === MY_IMMER) return target
//     const data = copies.get(target) || target
//     return getProxy(data[key])
//   },
//   set(target: any, key: string, val: any) {
//     const copy = getCopy(target)
//     const newVal = getProxy(val) as any
//     copy[key] = isProxy(newVal) ? newVal[MY_IMMER] : newVal
//     return true
//   },
// }

function getProxy<T extends object>(data: T): object {
  if (isPlainObject(data) || Array.isArray(data)) {
    if (proxies.has(data)) return proxies.get(data)
    const proxy = new Proxy(data, {
      get(target: any, key: string): any {
        if (key === MY_IMMER) return target
        const data = copies.get(target) || target
        return getProxy(data[key])
      },
      set(target: any, key: string, val: any) {
        const copy = getCopy(target)
        const newVal = getProxy(val) as any
        copy[key] = isProxy(newVal) ? newVal[MY_IMMER] : newVal
        return true
      },
    })
    proxies.set(data, proxy)
    return proxy
  }
  return data
}

const isChange = (data: any) => {
  if (proxies.has(data) || copies.has(data)) return true
}

const finalize = (resource: any) => {
  if (isPlainObject(resource) || Array.isArray(resource)) {
    if (isChange(resource)) {
      const copy = getCopy(resource)
      Object.keys(copy).forEach(key => {
        copy[key] = finalize(copy[key])
      })
      return copy
    }
    return resource
  }
  return resource
}

export const produce = (baseState: any, fn: (param: any) => void) => {
  const proxy = getProxy(baseState)
  fn(proxy)
  return finalize(baseState)
}
