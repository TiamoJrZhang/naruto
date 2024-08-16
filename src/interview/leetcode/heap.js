// 小顶堆与大顶堆
// 数组的第一个元素为空，为了index能从1开始

// 插入建堆
const priorityQueue = []
function insert(target) {
  priorityQueue.push(target)
  let index = priorityQueue.length - 1

  while (priorityQueue[index] > priorityQueue[Math.floor(index / 2)]) {
    swap(priorityQueue, index, Math.floor(index / 2))
    index = Math.floor(index / 2)
  }
}

function swap(queue, index, rootIndex) {
  let temp = queue[rootIndex]
  queue[rootIndex] = queue[index]
  queue[index] = temp
}

//原地建堆

//自下而上式堆化 ：将节点与其父节点比较，如果节点大于父节点（大顶堆）或节点小于父节点（小顶堆），则节点与父节点调整位置
const items = [, 5, 2, 3, 4, 1]

function upToDownBuildHeap() {
  let index = 1
  while (index < items.length - 1) {
    index++
    upToDownHeapify(items, index)
  }
}

function upToDownHeapify(items, index) {
  let rootIndex
  while ((rootIndex = Math.floor(index / 2)) > 0 && items[index] < items[rootIndex]) {
    swap(items, index, rootIndex)

    index = rootIndex
  }
}

upToDownBuildHeap()

//将节点与其左右子节点比较，如果存在左右子节点大于该节点（大顶堆）或小于该节点（小顶堆），则将子节点的最大值（大顶堆）或最小值（小顶堆）与之交换
//从最后一个非叶子节点开始遍历

function buildHeap(items) {
  const len = (items.length - 1) >>> 1
  for (let i = len; i >= 1; --i) {
    heapify(items, i)
  }
  console.log('items...', items)
  // return items
}

function heapify(items, i) {
  while (true) {
    let minIndex = i
    let leftIndex = i * 2
    let rightIndex = leftIndex + 1
    if (leftIndex <= items.length - 1 && items[minIndex] > items[leftIndex]) {
      minIndex = leftIndex
    }
    if (rightIndex <= items.length - 1 && items[minIndex] > items[rightIndex]) {
      minIndex = rightIndex
    }
    if (minIndex == i) break
    swap(items, i, minIndex)
    i = minIndex
  }
}

buildHeap([, 1, 9, 2, 8, 3, 7, 4, 6, 5])

//react优先队列
const queue = []

//push时候最小数字上升
function push(node) {
  queue.push(node)
  siftUp()
}

function siftUp() {
  let index = queue.length - 1

  while (true) {
    let parentIndex = index >>> 1
    if (queue[parentIndex] > queue[index]) {
      let parentNode = queue[parentIndex]
      queue[parentIndex] = queue[index]
      queue[index] = parentNode
      index = parentIndex
    } else {
      break
    }
  }
}

//pop时候去除数组的第一项，将最后一项作为第一项并且下沉
function pop() {
  let last = queue.pop()
  let first = queue[0]
  if (first != last) {
    queue[0] = last
    siftDown(last)
  }
}

function siftDown(node) {
  let index = 0

  while (index < queue.length) {
    let leftIndex = (index + 1) * 2 - 1
    let leftNode = queue[leftIndex]
    let rightIndex = leftIndex + 1
    let rightNode = queue[rightIndex]

    if (leftNode < node) {
      if (rightNode < leftNode) {
        queue[index] = rightNode
        queue[rightIndex] = node
        index = rightIndex
      } else {
        queue[index] = leftNode
        queue[leftIndex] = node
        index = leftIndex
      }
    } else if (rightNode < node) {
      queue[index] = rightNode
      queue[rightIndex] = node
      index = rightIndex
    } else {
      return
    }
  }
}

push(6)
push(7)
push(5)
push(4)
push(3)

pop()
pop()

console.log('queue...', queue)

//https://leetcode-cn.com/problems/kth-largest-element-in-an-array/
var findKthLargest = function(nums, k) {
  let i = 0
  while (i < k) {
    siftUp(i, nums)
    i++
  }
  for (let j = k; j < nums.length; j++) {
    const cur = nums[j]
    if (cur > nums[0]) {
      nums[0] = cur
      siftDown(nums, 0, k)
    }
  }
  console.log('nums[0]...', nums[0])
  return nums[0]
}

var swap = function(nums, pIndex, index) {
  let temp = nums[pIndex]
  nums[pIndex] = nums[index]
  nums[index] = temp
}

var siftUp = function(i, nums) {
  while (true) {
    let parentIndex = i >>> 1
    if (i > 0 && nums[parentIndex] > nums[i]) {
      swap(nums, parentIndex, i)
      i = i >>> 1
    } else {
      break
    }
  }
}

var siftDown = function(nums, index, k) {
  while (true) {
    let leftIndex = (index + 1) * 2 - 1
    let left = nums[leftIndex]
    let rightIndex = leftIndex + 1
    let right = nums[rightIndex]
    let minIndex = index
    if (leftIndex <= k - 1 && nums[minIndex] > left) {
      minIndex = leftIndex
    }
    if (rightIndex <= k - 1 && nums[minIndex] > right) {
      minIndex = rightIndex
    }
    if (minIndex === index) break
    swap(nums, minIndex, index)
    index = minIndex
  }
}

findKthLargest([3, 2, 1, 5, 6, 4], 2)

//https://leetcode-cn.com/problems/top-k-frequent-elements/
function swap(items, pIndex, index) {
  const temp = items[pIndex]
  items[pIndex] = items[index]
  items[index] = temp
}

function swim(nums, key, map, index) {
  while (true) {
    let parentIndex = index >>> 1
    let parentNum = nums[parentIndex]
    let count = map.get(nums[index])
    let parentCount = map.get(parentNum)
    if (parentIndex > 0 && parentCount > count) {
      swap(nums, parentIndex, index)
      index = parentIndex
    } else {
      break
    }
  }
}

function sink(nums, index, map) {
  while (true) {
    let minIndex = index
    let leftIndex = index * 2
    let rightIndex = leftIndex + 1
    let leftCount = map.get(nums[leftIndex])
    let rightCount = map.get(nums[rightIndex])
    if (leftIndex <= nums.length - 1 && map.get(nums[minIndex]) > leftCount) {
      minIndex = leftIndex
    }
    if (rightIndex <= nums.length - 1 && map.get(nums[minIndex]) > rightCount) {
      minIndex = rightIndex
    }
    if (minIndex === index) break
    swap(nums, minIndex, index)
    index = minIndex
  }
}

var topKFrequent = function(nums, k) {
  var map = new Map()
  var ans = [,]
  for (var i = 0; i < nums.length; i++) {
    var cur = nums[i]
    if (map.has(cur)) {
      let count = map.get(cur)
      map.set(cur, count + 1)
    } else {
      map.set(cur, 1)
    }
  }

  for ([key, value] of map) {
    if (ans.length <= k) {
      ans.push(key)
      const index = ans.length - 1
      //上浮一般是元素被放到数组最后，进行堆化操作
      swim(ans, key, map, index)
    } else {
      const count = value
      const topCount = map.get(ans[0])
      if (count > topCount) {
        ans[1] = key
        //下沉一般是元素被放到头部，进行堆化操作
        sink(ans, 1, map)
      }
    }
  }
  return ans.slice(1)
}

topKFrequent([5, 2, 5, 3, 5, 3, 1, 1, 3], 2)

//https://leetcode-cn.com/problems/merge-k-sorted-lists/submissions/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
  if (!lists || !lists.length) return null
  var dummy = new ListNode(-1)
  var head = dummy
  let i = 0
  var heap = []
  function swap(items, index, parentIndex) {
    var temp = items[index]
    items[index] = items[parentIndex]
    items[parentIndex] = temp
  }
  function swim(items, index) {
    while (true) {
      let parentIndex = (index - 1) >> 1
      if (index > 0 && items[parentIndex].val > items[index].val) {
        swap(items, index, parentIndex)
        index = parentIndex
      } else {
        break
      }
    }
  }
  function sink(items, index) {
    while (true) {
      var minIndex = index
      var leftIndex = index * 2 + 1
      var rightIndex = leftIndex + 1
      if (leftIndex <= items.length - 1 && items[minIndex].val > items[leftIndex].val) {
        minIndex = leftIndex
      }
      if (rightIndex <= items.length - 1 && items[minIndex].val > items[rightIndex].val) {
        minIndex = rightIndex
      }
      if (minIndex == index) break
      swap(items, index, minIndex)
      index = minIndex
    }
  }
  while (i < lists.length) {
    if (lists[i]) {
      heap.push(lists[i])
      swim(heap, heap.length - 1)
    }
    i++
  }
  while (heap.length) {
    let minNode
    //注意：这里不能直接删除堆顶, 会导致堆结构被破坏
    if (heap.length === 1) {
      minNode = heap.shift()
    } else {
      minNode = heap[0]
      heap[0] = heap.pop()
      sink(heap, 0)
    }
    head.next = minNode
    head = head.next
    const next = minNode.next
    if (next != null) {
      //注意：这里不能直接unshift一个元素，会导致堆结构被破坏
      heap.push(next)
      swim(heap, heap.length - 1)
    }
  }

  return dummy.next
}

//https://leetcode-cn.com/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/submissions/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
  if (!nums || !nums.length) return []
  // var start = 0, end = start + k
  // var i = 0
  // var ans = []
  // while (end <= nums.length) {
  //   var maxNum = Number.MIN_SAFE_INTEGER
  //   for (var i = start; i < end; i ++) {
  //     maxNum = Math.max(maxNum, nums[i])
  //   }
  //   ans.push(maxNum)
  //   start ++
  //   end ++
  // }
  // return ans
  let i = 0
  const heap = []
  const ans = []
  function swap(items, i, j) {
    var temp = items[i]
    items[i] = items[j]
    items[j] = temp
  }
  function swim(items, index) {
    while (true) {
      var parentIndex = (index - 1) >> 1
      if (parentIndex >= 0 && items[parentIndex].val < items[index].val) {
        swap(items, index, parentIndex)
        index = parentIndex
      } else {
        break
      }
    }
  }
  function sink(items, index) {
    while (true) {
      var maxIndex = index
      var leftIndex = index * 2 + 1
      var rightIndex = leftIndex + 1
      if (leftIndex <= items.length - 1 && items[leftIndex].val > items[maxIndex].val) {
        maxIndex = leftIndex
      }
      if (rightIndex <= items.length - 1 && items[rightIndex].val > items[maxIndex].val) {
        maxIndex = rightIndex
      }
      if (maxIndex == index) break
      swap(items, index, maxIndex)
      index = maxIndex
    }
  }
  while (i < k) {
    heap.push({val: nums[i], index: i})
    swim(heap, heap.length - 1)
    i++
  }
  ans.push(heap[0])
  for (let j = k; j < nums.length; j++) {
    heap.push({
      val: nums[j],
      index: j,
    })
    swim(heap, heap.length - 1)
    while (heap[0].index <= j - k) {
      //都是通过heap[0]替换成最后一个数来进行堆化
      heap[0] = heap.pop()
      sink(heap, 0)
    }
    ans.push(heap[0])
  }

  return ans.map(v => v.val)
}

//https://leetcode-cn.com/problems/last-stone-weight/comments/
var lastStoneWeight = function(stones) {
  if (!stones || !stones.length) return 0
  // while (stones.length > 1) {
  //   stones = stones.sort((a, b) => b - a)
  //   var a = stones.shift()
  //   var b = stones.shift()
  //   if (a === b) {
  //     continue
  //   } else {
  //     stones.push(Math.abs(b - a))
  //   }
  // }
  // return stones.length ? stones[0] : 0

  function swap(items, i, j) {
    var tmp = items[i]
    items[i] = items[j]
    items[j] = tmp
  }

  function swim(items, index) {
    while (true) {
      var parentIndex = (index - 1) >> 1
      if (parentIndex >= 0 && items[parentIndex] < items[index]) {
        swap(items, parentIndex, index)
        index = parentIndex
      } else {
        break
      }
    }
  }

  function sink(items, index, heapSize) {
    while (true) {
      var leftIndex = index * 2 + 1
      var rightIndex = leftIndex + 1
      var maxIndex = index
      if (leftIndex <= heapSize && items[leftIndex] > items[maxIndex]) {
        maxIndex = leftIndex
      }
      if (rightIndex <= heapSize && items[rightIndex] > items[maxIndex]) {
        maxIndex = rightIndex
      }
      if (maxIndex == index) break
      swap(items, maxIndex, index)
      index = maxIndex
    }
  }

  function buildHeap() {
    var heapSize = 0
    while (heapSize <= stones.length - 1) {
      swim(stones, heapSize)
      heapSize++
    }
  }

  function removeMaxStone() {
    swap(stones, 0, stones.length - 1)
    stones.pop()
    sink(stones, 0, stones.length - 1)
  }

  buildHeap()
  while (stones.length > 1) {
    var maxNum1 = stones[0]
    removeMaxStone()
    var maxNum2 = stones[0]
    removeMaxStone()
    console.log('stones...', stones)
    if (maxNum1 && maxNum2 && maxNum1 > maxNum2) {
      var newStone = maxNum1 - maxNum2
      stones.push(newStone)
      swim(stones, stones.length - 1)
    }
  }
}

lastStoneWeight([2, 7, 4, 1, 8, 1])
