/**
 * 原型链继承
 * 缺点：多个实例对引用类型的操作会被篡改
 */
const SuperType1: any = function(name: string) {
  this.name = name
  this.colors = ['red', 'blue']
}
SuperType1.prototype.sayName = function() {
  console.log(this.name)
}
const SubType1: any = function() {}
SubType1.prototype = new SuperType1()
SubType1.prototype.constructor = SubType1
let instance1 = new SubType1()
let instance2 = new SubType1()
instance1.colors.push('red')
console.log(instance2.colors)

/**
 * 构造函数继承
 * 缺点：1.只继承实例上的属性 2.父类构造函数会被多次调用
 */
function SuperType2() {
  this.name = 'lucy'
  this.colors = ['blue', 'yellow', 'red']
}
SuperType2.prototype.sayName = function() {
  console.log(this.name)
}
const SubType2: any = function() {
  SuperType2.call(this)
}
const instance3 = new SubType2()
const instance4 = new SubType2()

/**
 * 组合继承
 * 需要调用两次父类构造函数，第一次调用时SubType3原型上会有name值，但是第二次调用传入的name会覆盖第一次的值
 */
const SuperType3: any = function(name: string) {
  this.name = name
  this.colors = ['blue', 'yellow', 'red']
}
SuperType3.prototype.sayName = function() {
  console.log(this.name)
}
const SubType3: any = function(name: string) {
  SuperType3.call(this, name)
}
SubType3.prototype = new SuperType3()
SubType3.prototype.constructor = SubType3
const instance5 = new SubType3()
const instance6 = new SubType3()

/**
 * 原型继承
 * 缺点：对引用类型的操作会被篡改
 */
function extend(object: Object) {
  const Func: any = function() {}
  Func.prototype = object
  return new Func()
}

let obj = {
  name: 'jack',
  colors: ['blue', 'yellow', 'red'],
}

/**
 * 寄生继承
 */
const createAnother = function(obj: Object) {
  let newObj = extend(obj)
  newObj.sayName = function() {}
}

/**
 * 寄生组合继承（目前比较成熟）
 */
const SuperType5: any = function(name: string) {
  this.name = name
  this.colors = ['blue', 'yellow', 'red']
}
SuperType5.prototype.sayName = function() {
  console.log(this.name)
}
const SubType5: any = function(name: string) {
  SuperType5.call(this, name)
}
SubType5.prototype = Object.create(SubType5, {
  constructor: SubType5,
})
