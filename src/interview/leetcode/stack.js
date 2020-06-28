// https://leetcode-cn.com/problems/remove-all-adjacent-duplicates-in-string/
/**
 * @param {string} S
 * @return {string}
 */
var removeDuplicates = function(S) {
  return remove(S)
}

function remove(S) {
  var stack = [S[0]]
  for (var i = 1; i < S.length; i++) {
    var item = stack.pop()
    if (item == S[i]) {
      S = S.slice(0, i - 1) + S.slice(i + 1, S.length)
      stack = []
      return remove(S)
    }
    stack.push(S[i])
  }
  return S
}

var removeDuplicates2 = function(S) {
  if (!S || S.length == 0) return ''
  var stack = [S[0]]
  for (var i = 1; i < S.length; i++) {
    var topItem = stack[stack.length - 1]
    if (topItem == S[i]) {
      stack.pop()
    } else {
      stack.push(S[i])
    }
  }
  return stack.join('')
}

//https://leetcode-cn.com/problems/next-greater-element-i/
var nextGreaterElement = function(nums1, nums2) {
  var results = []
  var count = 0
  if (!nums1 || !nums2 || nums2.length == 0) return results
  while (nums1.length) {
    var cur = nums1.shift()
    var idx = nums2.indexOf(cur)
    for (var i = idx; i < nums2.length; i++) {
      if (nums2[i] > cur) {
        results[count] = nums2[i]
        break
      } else {
        results[count] = -1
      }
    }
    count++
  }
  return results
}

// 单调栈解法
var nextGreaterElement = function(nums1, nums2) {
  var map = new Map()
  var s = []
  var res = []
  for (var i = nums2.length - 1; i >= 0; i--) {
    while (s.length > 0 && s[s.length - 1] <= nums2[i]) {
      s.pop()
    }
    map.set(nums2[i], s.length > 0 ? s[s.length - 1] : -1)
    s.push(nums2[i])
  }
  for (var i = 0; i < nums1.length; i++) {
    res[i] = map.get(nums1[i])
  }
  return res
}

//https://leetcode-cn.com/problems/next-greater-element-ii/
//单调栈解法
var nextGreaterElements = function(nums) {
  var s = []
  var res = []
  var len = nums.length
  for (var i = len * 2 - 1; i >= 0; i--) {
    while (s.length > 0 && nums[i % len] >= s[s.length - 1]) {
      s.pop()
    }
    res[i % len] = s.length > 0 ? s[s.length - 1] : -1
    s.push(nums[i % len])
  }
  return res
}

// https://leetcode-cn.com/problems/sliding-window-maximum/
// 单调队列解法
var maxSlidingWindow = function(nums, k) {
  class SlidingWindow {
    constructor() {
      this.data = []
    }
    push(val) {
      var len = this.data.length
      while (len > 0 && val > this.data[len - 1]) {
        this.data.pop()
      }
      this.data.push(val)
    }
    max() {
      return this.data[0]
    }
    pop(val) {
      if (this.data.length > 0 && val == this.data[0]) {
        this.data.shift()
      }
    }
  }
  var window = new SlidingWindow()
  var res = []
  for (var i = 0; i < nums.length; i++) {
    if (i < k - 1) {
      window.push(nums[i])
    } else {
      window.push(nums[i])
      res.push(window.max())
      window.pop(nums[i - k + 1])
    }
  }
  return res
}

//https://leetcode-cn.com/problems/implement-queue-using-stacks/
var MyQueue = function() {
  this.stack1 = []
  this.stack2 = []
}

/**
 * Push element x to the back of queue.
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
  this.stack1.push(x)
}

/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function() {
  if (this.stack2.length == 0) {
    while (this.stack1.length) {
      var item = this.stack1.pop()
      this.stack2.push(item)
    }
  }
  var first = this.stack2.pop()
  return first
}

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function() {
  if (this.stack2.length == 0) {
    while (this.stack1.length) {
      var item = this.stack1.pop()
      this.stack2.push(item)
    }
  }

  var first = this.stack2[this.stack2.length - 1]
  return first
}

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
  return !this.stack1.length && !this.stack2.length
}
