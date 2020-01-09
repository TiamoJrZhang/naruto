
/**
 * 深度拷贝代码实现
 * 解决循环引用，采用hash表的方式
 * 解决symbol对象拷贝，使用Reflect.ownKeys
 * 
 */
function isObject(source) {
  return typeof source === 'object' && source !== null
}

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

var a = {
	name: "muyiy",
	a1: undefined,
	a2: null,
	a3: 123
}
a.circleRef = a

deepClone(a)