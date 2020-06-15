function isObject(source: any): boolean {
  return typeof source === 'object' && source != null
}

export function deepClone(source: any, hashMap = new Map()) {
  if (!isObject(source)) return source
  if (hashMap.get(source)) return source
  const target: any = Array.isArray(source) ? source.slice() : {...source}
  hashMap.set(source, target)
  Reflect.ownKeys(source).forEach((key: string) => {
    if (isObject(source[key])) {
      target[key] = deepClone(source[key], hashMap)
    } else {
      target[key] = source[key]
    }
  })
  return target
}

interface NodeInter {
  parent?: ResInter
  key?: undefined | string
  data?: any
}

interface ResInter {
  [key: string]: any
}

function find(uniqueList: any[], data: any) {
  const item = uniqueList.find(item => item.source === data)
  return item
}

export function deepCloneLoop(source: any) {
  const uniqueList = []
  let end: ResInter = {}
  const stack: NodeInter[] = [
    {
      parent: end,
      key: undefined,
      data: source,
    },
  ]

  while (stack.length) {
    const curItem = stack.pop()
    const {parent, key, data} = curItem
    let item = find(uniqueList, data)
    if (find(uniqueList, data)) {
      parent[key] = item.target
      continue
    }

    let res = parent
    if (key) {
      res = parent[key] = {}
    }
    uniqueList.push({
      source: data,
      target: res,
    })

    Reflect.ownKeys(data).forEach((k: string) => {
      if (isObject(data[k])) {
        stack.push({
          parent: res,
          key: k,
          data: data[k],
        })
      } else {
        res[k] = data[k]
      }
    })
  }

  return end
}
