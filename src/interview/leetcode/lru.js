var DoubleLinkNode = function(key, value) {
  this.key = key
  this.value = value
  this.prev = null
  this.next = null
}

/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.capacity = capacity
  this.size = 0
  this.head = new DoubleLinkNode()
  this.tail = new DoubleLinkNode()
  this.head.next = this.tail
  this.tail.prev = this.head
  this.map = new Map()
}

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  var node = this.map.get(key)
  if (!node) return -1
  this.removeFromList(node)
  this.addToFirst(node)
  return node.value
}

LRUCache.prototype.addToFirst = function(node) {
  var temp = this.head.next
  this.head.next = node
  node.prev = this.head
  node.next = temp
  temp.prev = node
}

LRUCache.prototype.removeFromList = function(node) {
  let tempForPrev = node.prev
  let tempForNext = node.next
  tempForPrev.next = tempForNext
  tempForNext.prev = tempForPrev
}

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  let node = this.map.get(key)
  if (node == null) {
    let newNode = new DoubleLinkNode(key, value)
    this.map.set(key, newNode)
    this.addToFirst(newNode)
    this.size++
    if (this.size > this.capacity) {
      var last = this.tail.prev
      this.removeFromList(last)
      this.map.delete(last.key)
      this.size--
    }
  } else {
    node.value = value
    this.removeFromList(node)
    this.addToFirst(node)
  }
}
