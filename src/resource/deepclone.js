
/**
 * 深度拷贝代码实现
 * 解决循环引用，采用hash表的方式
 * 解决symbol属性值拷贝，使用Reflect.ownKeys
 * 方式一采用递归的方式，但是会爆栈
 * 方式二采用循环的方式，破解递归爆栈
 */
function isObject(source) {
  return typeof source === 'object' && source !== null
}
// 方式一
function deepClone(source, hash = new Map()) {
  if (!isObject(source)) return source
  if (hash.get(source)) return hash.get(source)
  const target = Array.isArray(source) ? source.slice() : {...source}
  hash.set(source, target)
  Reflect.ownKeys(source).forEach((key) => {
    if (isObject(source[key])) {
      deepClone(source[key], hash)
    } else {
      target[key] = source[key]
    }
  })
  return target
}

//方式二
function cloneLoop(source) {
  const res = {}
  const stack = [{
    data: source
  }]

  while(stack.length) {
    const node = stack.pop()
    const data = node.data

    Reflect.ownKeys(data).forEach(v => {
      if (isObject(data[v])) {
        stack.push({
          data: data[v]
        })
      } else {
        res[v] = data[v]
      }
    })
  }

  return res

}

var a = {
	name: "muyiy",
	a1: undefined,
	a2: null,
  a3: 123,
  data: {
    time: +new Date()  
  }
}
a.circleRef = a

deepClone(a)
cloneLoop(a)