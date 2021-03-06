/**
 * 深度拷贝代码实现
 * 解决循环引用，采用hash表的方式
 * 解决symbol属性值拷贝，使用Reflect.ownKeys
 * 方式一采用递归的方式，但是会爆栈
 * 方式二采用循环的方式，破解递归爆栈
 */

function isObject(source: any): boolean {
  return typeof source === 'object' && source != null
}

//方式一
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

//方式二
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

const a: any = {
  name: 'muyiy',
  a1: undefined,
  a2: null,
  a3: 123,
  data: {
    time: +new Date(),
  },
}
a.circleRef = a

deepClone(a)
deepCloneLoop(a)
