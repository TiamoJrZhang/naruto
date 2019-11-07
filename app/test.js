
//单例模式
// var singleTon = function(fn) {
//     var result;
//     return function() {
//         // console.log('result', result);
//         return result || (result = fn.apply(this, arguments));
//     }
// };

// var createMask = singleTon(function() {
//     var ele = document.createElement('div');
//     ele.style.width = 200 + 'px';
//     ele.style.height = 200 + 'px';
//     ele.style.background = '#ccc';
//     var createdEle = document.body.appendChild(ele);
//     return createdEle;
// });

// createMask();
// setTimeout(function() {
//     createMask();
// }, 1000) 


// var fn1 = function() {}
// var fn2 = function() {}
// var fn3 = function(a, b) {return a + b}

// function compose(...funcs) {
//     var a = funcs.reduce(function(ret, item) {
//         var d = function (...args) {
//             return ret(item(...args))
//         }
//         console.log('d', d);
//         return d
//     })
//     console.log('a', a)
//     return a;
// }

// var c = compose(fn1, fn2, fn3)(1, 2)
// console.log('c', c);


// function chained(...funcs) {
//     if (funcs.length === 0) {
//        return arg => arg
//     }

//     if (funcs.length === 1) {
//       return funcs[0]
//     }

//     var a = funcs.reduce(function(a, b) {
//         return function(...args) {
//             return b(a(...args))
//         }
//     })
//     return a
// }

// function f1(x){ return x*2 }
// function f2(x){ return x+2 }
// function f3(x){ return x+2 }

// // console.log(chained(f1, f2, f3)(0)); 


// function chained2(...funcs) {
//     return function(initNum) {
//         return funcs.reduce(function(a, b) {
//             return b(a)
//         }, initNum)
//     }
// }

// console.log(chained2(f1, f2, f3)(1)) 



// class Model {
//     getData() {
//         return [{name: 'jack'}, {name: 'Alice'}]
//     }
// }

// function warp(Model, key) {
//     let target = Model.prototype
//     let descriptor = Object.getOwnPropertyDescriptor(target, key)
//     console.log(descriptor)

//     let timeStatic = (...args) => {
//         let start = new Date().valueOf()
//         try {
//             return descriptor.value.apply(this, args)
//         } finally {
//             let end = new Date().valueOf()
//             console.log(`consume: ${end - start}`)
//         }
//     }

//     Object.defineProperty(target, key, {
//         ...descriptor, value: timeStatic
//     })
// }

// warp(Model, 'getData')

// var ex = new Model()
// console.log(ex.getData())

// class A {
//     sayA() {
//         console.log('A')
//     }
// }

// class B {
//     sayB() {
//         console.log('B')
//     }
// }

// class C {}
// for (let key of Object.getOwnPropertyNames(A.prototype)) {
//     if (key === 'constructor') continue
//     Object.defineProperty(C.prototype, key, Object.getOwnPropertyDescriptor(A.prototype, key))
// }
// for (let key of Object.getOwnPropertyNames(B.prototype)) {
//     if (key == 'constructor') continue
//     Object.defineProperty(C.prototype, key, Object.getOwnPropertyDescriptor(B.prototype, key))
// }

// function mixin(constructor) {
//     return function(...args) {
//         for (let arg of args) {
//             for (let key of Object.getOwnPropertyNames(arg.prototype)) {
//                 if (key === 'constructor') continue
//                 Object.defineProperty(constructor.prototype, key, Object.getOwnPropertyDescriptor(arg.prototype, key))
//             }           
//         }
//     }
// }

// mixin(C)(A, B)

// let c = new C()
// c.sayA()
// c.sayB()

// @name
// class Person {
//     sayHi() {
//         console.log(`hello, my name is ${this.name}`)
//     }
// }

// function name(parentClass) {
//     return class extends parentClass {
//         name = 'niko'
//     }
// }

// new Person().sayHi()

// @seal
// class Person {
//     sayHi() {
//         console.log('Hello')
//     }
// }

// function seal(ctor) {
//     let descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, 'sayHi')
//     Object.defineProperty(ctor.prototype, 'sayHi', {
//         ...descriptor, writable: false
//     })
// }

// const data = {
//     name: ''
// }

// Object.keys(data).forEach((v) => {
//     Object.defineProperty(data, v, {
//         enumerable: true,
//         configurable: true,
//         get: function() {
//             console.log('get')
//         },
//         set: function(newVal) {
//             console.log(`我是${newVal}`)
//         }
//     })
// })

// class EventEmeitter {
//     constructor() {
//         this._events = this._events || new Map()
//         this._maxListeners = this._maxListeners || 10
//     }
// }

// EventEmeitter.prototype.addListener = function(type, fn) {
//     if (!this._events.get(type)) this._events.set(type, fn)
// }   

// EventEmeitter.prototype.emit = function(type, ...args) {
//     let handler = this._events.get(type)

//     if (args.length > 0) {
//         handler.apply(this, args)
//         return 
//     }

//     handler.call(this)

//     return true
// }   

// const emitter = new EventEmeitter()

// emitter.addListener('sayHello', function() {
//     console.log(arguments.length)
// })

// emitter.emit('sayHello', 'jack', 'lily')
// const Vue = (function() {
//     let uid = 0;
//     // 用于储存订阅者并发布消息
//     class Dep {
//       constructor() {
//         // 设置id,用于区分新Watcher和只改变属性值后新产生的Watcher
//         this.id = uid++;
//         // 储存订阅者的数组
//         this.subs = [];
//       }
//       // 触发target上的Watcher中的addDep方法,参数为dep的实例本身
//       depend() {
//         Dep.target.addDep(this);
//         console.log(Dep.target)
//       }
//       // 添加订阅者
//       addSub(sub) {
//         this.subs.push(sub);
//       }
//       notify() {
//         // 通知所有的订阅者(Watcher)，触发订阅者的相应逻辑处理
//         this.subs.forEach(sub => sub.update());
//       }
//     }
//     // 为Dep类设置一个静态属性,默认为null,工作时指向当前的Watcher
//     Dep.target = null;
//     // 监听者,监听对象属性值的变化
//     class Observer {
//       constructor(value) {
//         this.value = value;
//         this.walk(value);
//       }
//       // 遍历属性值并监听
//       walk(value) {
//         Object.keys(value).forEach(key => this.convert(key, value[key]));
//       }
//       // 执行监听的具体方法
//       convert(key, val) {
//         defineReactive(this.value, key, val);
//       }
//     }
  
//     function defineReactive(obj, key, val) {
//       const dep = new Dep();
//       // 给当前属性的值添加监听
//       let chlidOb = observe(val);
//       Object.defineProperty(obj, key, {
//         enumerable: true,
//         configurable: true,
//         get: () => {
//           // 如果Dep类存在target属性，将其添加到dep实例的subs数组中
//           // target指向一个Watcher实例，每个Watcher都是一个订阅者
//           // Watcher实例在实例化过程中，会读取data中的某个属性，从而触发当前get方法
//           if (Dep.target) {
//             dep.depend();
//           }
//           return val;
//         },
//         set: newVal => {
//           if (val === newVal) return;
//           val = newVal;
//           // 对新值进行监听
//           chlidOb = observe(newVal);
//           // 通知所有订阅者，数值被改变了
//           dep.notify();
//         },
//       });
//     }
  
//     function observe(value) {
//       // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听
//       if (!value || typeof value !== 'object') {
//         return;
//       }
//       return new Observer(value);
//     }
  
//     class Watcher {
//       constructor(vm, expOrFn, cb) {
//         this.depIds = {}; // hash储存订阅者的id,避免重复的订阅者
//         this.vm = vm; // 被订阅的数据一定来自于当前Vue实例
//         this.cb = cb; // 当数据更新时想要做的事情
//         this.expOrFn = expOrFn; // 被订阅的数据
//         this.val = this.get(); // 维护更新之前的数据
//       }
//       // 对外暴露的接口，用于在订阅的数据被更新时，由订阅者管理员(Dep)调用
//       update() {
//         this.run();
//       }
//       addDep(dep) {
//         // 如果在depIds的hash中没有当前的id,可以判断是新Watcher,因此可以添加到dep的数组中储存
//         // 此判断是避免同id的Watcher被多次储存
//         if (!this.depIds.hasOwnProperty(dep.id)) {
//           dep.addSub(this);
//           this.depIds[dep.id] = dep;
//         }
//       }
//       run() {
//         const val = this.get();
//         console.log(val);
//         if (val !== this.val) {
//           this.val = val;
//           this.cb.call(this.vm, val);
//         }
//       }
//       get() {
//         // 当前订阅者(Watcher)读取被订阅数据的最新更新后的值时，通知订阅者管理员收集当前订阅者
//         Dep.target = this;
//         const val = this.vm._data[this.expOrFn];
//         // 置空，用于下一个Watcher使用
//         Dep.target = null;
//         console.log(Dep.target, 2);
//         return val;
//       }
//     }
  
//     class Vue {
//       constructor(options = {}) {
//         // 简化了$options的处理
//         this.$options = options;
//         // 简化了对data的处理
//         let data = (this._data = this.$options.data);
//         // 将所有data最外层属性代理到Vue实例上
//         Object.keys(data).forEach(key => this._proxy(key));
//         // 监听数据
//         observe(data);
//       }
//       // 对外暴露调用订阅者的接口，内部主要在指令中使用订阅者
//       $watch(expOrFn, cb) {
//         new Watcher(this, expOrFn, cb);
//       }
//       _proxy(key) {
//         Object.defineProperty(this, key, {
//           configurable: true,
//           enumerable: true,
//           get: () => this._data[key],
//           set: val => {
//             this._data[key] = val;
//           },
//         });
//       }
//     }
  
//     return Vue;
//   })();
  
//   let demo = new Vue({
//     data: {
//       text: '',
//     },
//   });
  
//   const p = document.getElementById('p');
//   const input = document.getElementById('input');
  
//   input.addEventListener('keyup', function(e) {
//     demo.text = e.target.value;
//   });
  
//   demo.$watch('text', str => p.innerHTML = str);

// fetch('http://example.com/movies.json').then((res) => {
//     let a = res.json()
//     return a
// }).then((myJson) => {
//     console.log(myJson)
// })

// const toStr = Function.prototype.call.bind(Object.prototype.toString)

Function.prototype.call2 = function(context) {
  context = context ? Object(context) : window
  context.fn = this
  let args = []
  for (let i = 1, len = arguments.length; i < len; i ++) {
    args.push('arguments[' + i + ']')
  }
  const result = eval('context.fn(' + args + ')') 
  delete context.fn
  return result
}

Function.prototype.apply2 = function(context, arr) {
  context = context ? Object(context) : window
  context.fn = this
  let result

  if (arr) {
    result = context.fn(...arr)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

Function.prototype.bind2 = function(context) {
  var self = this
  if (typeof this !== 'function') {
    throw new Error('some error')
  }
  var args = Array.prototype.slice.call(arguments, 1)
  var fNOP = function() {}
  var Ret = function() {
    var bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(
            this instanceof Ret ? this : context, 
            args.concat(bindArgs)
          )
  }
  fNOP.prototype = this.prototype
  Ret.prototype = new fNOP()
  return Ret
}

var obj = {
  value: 1
}

function Bar(name, age) {
  this.name = 'July'
  console.log(name, age, this.value)
}

var BindFunc = Bar.bind(obj, 'jack')
var H = new BindFunc()
console.log(H.name)

// var obj = {
//   value: 1
// }

// function test(name, age) {
//   console.log(`my name is ${name}, age is ${age}`)
//   return 1
// }

// var ret = test.apply(obj, ['jack', '17'])
// console.log('ret', ret)

//实现new操作符
function create() {
  var Con = [].shift.call(arguments)
  var context = new Object()
  context = Object.create(Con.prototype, {foo: { 
    writable: true,
    configurable: true,
    value: "hello" 
  }}) 
  console.log('context.prototype', context)
  var ret = Con.apply(context, arguments)
  return ret instanceof Object ? ret : context
}

function Animal(color) {
  this.color = color
}

Animal.prototype.sayHello = function() {
  console.log('miaomaio')
}

var cat = create(Animal, 'black')
console.log(cat.color)
cat.sayHello()

function cloneShallow(source) {
  var target = {}
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key]
    }
  }
  console.log('target', target)
}

var source = {
  name: 'jack',
  age: 18,
  height: '175cm',
  bor: {
    age: 16,
    name: 'join',
    height: '170cm'
  }
}
// source.source2 = source
// console.log('source', source)

// function cloneDeep2(source) {

//     if (!isObject(source)) return source; // 非对象返回自身
      
//     var target = Array.isArray(source) ? [] : {};
//     for(var key in source) {
//         if (Object.prototype.hasOwnProperty.call(source, key)) {
//             if (isObject(source[key])) {
//                 target[key] = cloneDeep2(source[key]); // 注意这里
//             } else {
//                 target[key] = source[key];
//             }
//         }
//     }
//     return target;
// }

// // 使用上面测试用例测试一下
// var b = cloneDeep2(source);
// console.log(b.bor === source.bor);

// function isObject(obj) {
//   return typeof obj === 'object' && obj !== null
// }

// function find(arr, item) {
//   for (var i = 0; i < arr.length; i ++) {
//     if (arr[i].source == item) {
//       return arr[i]
//     }
//   }
//   return null
// }

// var b = {
//   name: 1
// }
// var source = {
//   a: b,
//   c: b
// }

// function cloneDeep(source, uniqueList=[]) {
//   if (!isObject(source)) return source
//   // if (hash.has(source)) return hash.get(source) 

//   // hash.set(source, target)
//   if (find(uniqueList, source) != null) return find(uniqueList, source).target
//   var target = Array.isArray(source) ? [] : {}
  
//   uniqueList.push({
//     source: source,
//     target: target
//   })
  
//   for (var key in source) {
//     if (Object.prototype.hasOwnProperty.call(source, key)) {
//       if (typeof source[key] === 'object') {
//         // console.log('source', source)
//         target[key] = cloneDeep(source[key], uniqueList)
//       } else {
//         target[key] = source[key]
//       }
//     }
//   }
//   console.log('target', target)
//   return target
// }
// cloneDeep(source)

var source = {
  name: 'jack',
  address: {
    street: 'dong',
    code: '33025'
  }
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

// function bfsCloneDeep(source) {
//   var stack = []
//   var res = {}
//   var item = {
//     key: null,
//     data: source
//   }
//   stack.push(item)

//   while (stack.length) {
//     // res[key] = source[key]
//     var item = stack.shift()

//     if (item.key) {
//       res[key] = {}
//     }
    
//     for (let key in item.data) {
//       if (isObject(item.data[key])) {
//         stack.push({
//           key: key,
//           data: item.data[key]
//         })
//       } else {
//         res[key] = item.data[key]
//       }
//     } 
//   }
//   return res
// }


// console.log(bfsCloneDeep(source)) 



// function bfsCloneDeep(x) {
//   const root = {};

//   // 栈
//   const loopList = [
//       {
//           parent: root,
//           key: undefined,
//           data: x,
//       }
//   ];

//   while(loopList.length) {
//       // 广度优先
//       const node = loopList.pop();
//       const parent = node.parent;
//       const key = node.key;
//       const data = node.data;

//       // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
//       let res = parent;
//       if (typeof key !== 'undefined') {
//           res = parent[key] = {};
//       }

//       for(let k in data) {
//           if (data.hasOwnProperty(k)) {
//               if (typeof data[k] === 'object') {
//                   // 下一次循环
//                   loopList.push({
//                       parent: res,
//                       key: k,
//                       data: data[k],
//                   });
//               } else {
//                   res[k] = data[k];
//               }
//           }
//       }
//   }

//   return root;
// }
var dfs = function(node, nodeList) {
  if (node) {
    nodeList.push(node)
    if (node.children && node.children.length) {
      for (var i = 0; i < node.children.length; i ++) {
        dfs(node.children[i], nodeList)
      }
    }
  }
  console.log('nodeList', nodeList) 
}

var dfs2 = function(node) {
  var nodeList = []
  if (node) {
    var stack = []
    stack.push(node)

    while(stack.length != 0) {
      var item = stack.shift()
      nodeList.push(item)
      if (item.children && item.children.length) {
        for (var i = 0; i < item.children.length; i ++) {
          stack.push(item.children[i])
        }
      }
    }
  }
  console.log('nodeList2', nodeList)
}

var exceDfs = function() {
  var root = document.getElementById('root')
  dfs(root, nodeList=[])
  dfs2(root)
}
window.onload = exceDfs


class TireNode {
  constructor() {
    this.numPass = 0
    this.numEnd = 0
    this.edges = []
    this.value = ''
    this.isEnd = false
  }
}

class Tire {
  constructor() {
    this.root = new TireNode()
  }
  isValid(str) {
    return /^[a-z1-9]+$/i.test(str)
  }
  isContainPrefix(word) {
    if (this.isValid(word)) {
      var cur = this.root
      for (var i = 0; i < word.length; i ++) {
        var c = word.charCodeAt(i)
        c -= 48
        if (cur.edges[c]) {
          cur = cur.edges[c]
        } else {
          return false
        }
      }
      return true
    }
    return false
  }
  insert(word) {
    // addWord
    if (this.isValid(word)) {
      var cur = this.root;
      for (var i = 0; i < word.length; i++) {
        var c = word.charCodeAt(i);
        c -= 48; //减少”0“的charCode
        var node = cur.edges[c];
        if (!node) {
          var node = (cur.edges[c] = new TireNode());
          node.value = word.charAt(i);
          node.numPass = 1; //有N个字符串经过它
        } else {
          node.numPass++;
        }
        cur = node;
      }
      cur.isEnd = true; //樯记有字符串到此节点已经结束
      cur.numEnd++; //这个字符串重复次数

      return true;
    } else {
      return false;
    }
  }
  preTraversal(cb) { //先序遍历
    function preTraversalImpl(root, str, cb){  
      cb(root, str)
      for (let i = 0, n = root.edges.length; i < n; i ++){
        let node = root.edges[i]
        if(node) {
          preTraversalImpl(node, str + node.value, cb)
        }
      }
    }  
    preTraversalImpl(this.root, '', cb)
  }
}

var map = {}
var theTire = new Tire()
theTire.insert('hello')
theTire.insert('hello')
theTire.insert('hello2')
theTire.preTraversal(function(node, str) {
  if (node.isEnd) {
    map[str] = node.numEnd
  }
})
console.log('has', theTire.isContainPrefix('hel'))
console.log('theTire', map)

//react单链表深度遍历
const a1 = {name: 'a1'}
const b1 = {name: 'b1'}
const b2 = {name: 'b2'}
const b3 = {name: 'b3'}
const c1 = {name: 'c1'}
const c2 = {name: 'c2'}
const d1 = {name: 'd1'}
const d2 = {name: 'd2'}

a1.render = () => [b1, b2, b3]
b1.render = () => []
b2.render = () => [c1]
b3.render = () => [c2]
c1.render = () => [d1, d2]
c2.render = () => []
d1.render = () => []
d2.render = () => []

// function walk(instance) {
//   console.trace()
//   doWork(instance)
//   const children = instance.render()
//   children.forEach(v => {
//     walk(v)
//   })
// }

// function doWork(o) {
//   console.log(o.name)
// }

// walk(a1)

class Node {
  constructor(instance) {
    this.instance = instance
    this.return = null
    this.child = null
    this.sibling = null
  }
}

function link(parent, elements) {
  if (elements === null) elements = []

  parent.child = elements.reduceRight((previous, current) => {
    const node = new Node(current)
    node.return = parent
    node.sibling = previous
    return node
  }, null)

  return parent.child //返回数组中第一个元素
}

// const children = [b1, b2]
// const parent = new Node(a1)
// const child = link(parent, children)

function doWork(node) {
  if (!node) return
  console.log(node.instance.name)
  const children = node.instance.render()
  //如果children没有值则不再遍历
  if (children && children.length) {
    return link(node, children)
  }
  return null
}

function walk(o) {
  let root = o
  let current = o

  while(true) {
    let child = doWork(current)

    if (child) {
      current = child
      continue
    }
    
    //如果没有child则遍历相邻节点
      //如果没有相邻节点则向上找父节点
    while (current.sibling === null) { 
      if (!current.return || current.return == root) {
        return
      }
      current = current.return
    }
    current = current.sibling
  }
}

walk(new Node(a1))


// function ListNode(val) {
//   this.val = val
//   this.next = null
// }

// function link(arr) {
//   for (var i = 0; i < arr.length; i ++) {
//     var current = new Node(arr[i])
//     if (arr[i + 1]) {
//       current.next = new Node(arr[i + 1])
//     }
//   }
//   console.log(arr)
// }

// var mergeTwoLists = function(l1, l2) {
//   for (var i = 0; i < l2.length; i++) {
//       l1.push(l2[i])
//   }
//   for (var j = 0; j < l1.length; j ++) {
//     if (j+1 > l1.length) return
//     for (var k = j+1; k < l1.length; k ++) {
//       if (l1[j] > l1[k]) {
//         var a = l1[j]
//         l1[j] = l1[k]
//         l1[k] = a
//       }
//     }
//   }
//   link(l1)
// };

// mergeTwoLists([1,2,4], [1,3,4])

// function LinkList() {
//   this.head = new NewNode('head')
//   this.insert = insert
//   this.find = find
//   this.display = display
// }

// function NewNode(val) {
//   this.val = val
//   this.next = null
// }

// function find(item) {
//   let current = this.head
//   while (current != null && current.val != item) {
//     current = current.next
//   }
//   return current
// }

// function insert(value, item) {
//   const newNode = new NewNode(value)
//   let current

//   if (item) {
//     current = this.find(item)
//     newNode.next = current.next
//     current.next = newNode
//   } else {
//     current = this.head
//     while (current.next != null) {
//       current = current.next
//     }
//     current.next = newNode
//   } 
// }

// function display() {
//   let current = this.head
//   while (current.next != null) {
//     current = current.next
//     console.log('current', current)
//   }
// }

// let lList = new LinkList()
// lList.insert(2)
// lList.insert(4)
// lList.insert(3)
// lList.display()

function ListNode(val) {
  this.val = val
  this.next = null
}

// var addTwoNumbers = function(l1, l2) {
//   let result = new ListNode(null);
//   let nextRst = result;
//   // 进位
//   let params = 0 // 传给下一个层级的值
//   let val = 0 // 传给当前层级的值
  
//   while(l1 != null || l2 != null) {
//     // TODO
//     let x = (l1 != null) ? l1.val : 0;
//     let y = (l2 != null) ? l2.val : 0;
    
//     val = (x + y + params) % 10;
//     params = Math.floor((x + y + params) / 10);
    
//     nextRst.next = new ListNode(val) 
//     nextRst = nextRst.next
    
//     if(l1 != null) l1 = l1.next
//     if(l2 != null) l2 = l2.next        
//   }
  
//   if(params) {
//      nextRst.next = new ListNode(params)
//   }
  
//   return result.next
// };










