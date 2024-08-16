function swap(items, i, j) {
  var temp = items[i]
  items[i] = items[j]
  items[j] = temp
}

// //自下而上，插入建堆
// const items = [,]
// function insertHeap(key) {
//   items.push(key) 
//   var i = items.length - 1
//   while (i > 0 && items[i] > items[i >> 1]) {
//     swap(items, i , i >> 1) 
//     i = i >> 1
//   }
// }

// insertHeap(6)
// insertHeap(5)
// insertHeap(4)
// insertHeap(1)
// insertHeap(3)
// insertHeap(2)
// insertHeap(8)
// console.log('items...', items)

// //自底向上建堆
// //通过不断累加堆的深度，从底部不断的往上进行对比，类似插入建堆
// const heap = [, 5, 2, 3, 4, 1]

// function buildHeap() {
//   const len = heap.length - 1
//   let heapSize = 1
//   while (heapSize < len) {
//     heapSize ++
//     heapify(heap, heapSize)
//   }
// }

// function heapify(heaps, i) {
//   while (i > 0 && heaps[i >> 1] > heaps[i]) {
//     swap(heaps, i, i >> 1)
//     i = i >> 1
//   }
// }
// buildHeap()


// //自顶向下建堆
// //通过不断比较左右子节点来建堆
// const items2 = [, 5, 2, 3, 4, 1]
// function buildHeap2() {
//   let n = (items2.length - 1) >> 1
//   while (n > 0) {
//     heapify2(n, items2)
//     n --
//   }
// }

// function heapify2(n, items) {
//   while (true) {
//     var left = 2 * n
//     var right = (2 * n) + 1
//     var minIndex = n
//     if (left < items2.length && items[n] > items[left]) {
//       minIndex = left
//     }
//     if (right < items2.length &&  items[minIndex] > items[right]) {
//       minIndex = right
//     }
//     if (minIndex === n) break
//     swap(items, n, minIndex)
//     n = minIndex
//   }
// }

// buildHeap2()
// console.log('items2...', items2)

// //堆排序
// const items2 = [, 5, 2, 3, 4, 1]
// function heapSort() {
//   let heapSize = items2.length - 1
//   buildHeap(heapSize, items2)
//   for (var i = items2.length - 1; i > 1; i --) {
//     swap(items2, 1, i)
//     heapSize --
//     heapify(1, items2, heapSize)
//   }
// }

// function buildHeap(heapSize, items) {
//   let i =  heapSize >> 1
//   while (i > 0) {
//     heapify(i, items, heapSize)
//     i --
//   }
// }

// function heapify(i, items, heapSize) {
//   while (true) {
//     let leftIndex = i * 2
//     let rightIndex = i * 2 + 1
//     let minIndex = i
//     if (leftIndex <= heapSize && items[i] < items[leftIndex]) {
//       minIndex = leftIndex
//     } 
//     if (rightIndex <= heapSize && items[minIndex] < items[rightIndex]) {
//       minIndex = rightIndex
//     }
//     if (minIndex == i) break
//     swap(items, i, minIndex)
//     i = minIndex
//   }
// }

// heapSort()
// console.log('items2...', items2)

// 自前向后 小顶堆
function buildHeap(heap) {
  const len = heap.length
  let index = 2

  while (index <= len - 1) {
    let currentIndex = index
    let upperIndex = Math.floor(index >> 1) 

    while (upperIndex > 0 && heap[upperIndex] && heap[currentIndex] < heap[upperIndex]) {
      const current = heap[currentIndex]
      heap[currentIndex] = heap[upperIndex]
      heap[upperIndex] = current

      currentIndex = Math.floor(currentIndex >> 1)
      upperIndex = Math.floor(currentIndex >> 1)
    }

    index ++
  }
  
  return heap
}

// 自后向前 小顶堆
function buildHeap2(heap) {
  const len = heap.length
  let index = Math.floor(len >> 1)

  function swap(i, j, heap) {
    const temp = heap[i]
    heap[i] = heap[j]
    heap[j] = temp
  }

  while (index >= 1) {

    let tempIndex = index
    while (true) {
      let minIndex = tempIndex
      let leftIndex = 2 * minIndex
      let rightIndex = 2 * minIndex + 1
      if (leftIndex <= len && heap[leftIndex] < heap[minIndex]) {
        minIndex = leftIndex
      }
      if (rightIndex <= len && heap[rightIndex] < heap[minIndex]) {
        minIndex = rightIndex
      }

      if (minIndex === tempIndex) break
      swap(minIndex, tempIndex, heap)
      tempIndex = minIndex
    }

    index --
  }

  return heap
}

const queue = []

function push(item) {
  queue.push(item)

  siftUp()
}

function pop() {
  const last = queue.pop()
  const first = queue[0]
  if (last !== first) {
    queue[0] = last
    siftDown(last)
  }
}

function swap(i, j, heap) {
  let temp = heap[i]
  heap[i] = heap[j]
  heap[j] = temp
}

function siftUp() {
  let index = queue.length - 1

  while (true) {
    let parentIndex = Math.floor(index >>> 1)
    if (queue[parentIndex] > queue[index]) {
      swap(parentIndex, index, queue)
      index = parentIndex
    } else {
      break
    }
  }
}

function siftDown() {
  let index = 0
  while(index < queue.length) {
    let minIndex = index
    let leftIndex = 2 * index + 1
    let rightIndex = leftIndex + 1

    if (queue[leftIndex] < queue[minIndex]) {
      minIndex = leftIndex
    }

    if (queue[rightIndex] < queue[minIndex]) {
      minIndex = rightIndex
    }

    if (minIndex === index) break
    swap(minIndex, index, queue)
    index = minIndex 
  }
}

// https://leetcode.cn/problems/kth-largest-element-in-an-array/description/?envType=study-plan-v2&envId=top-100-liked
// 215. 数组中的第K个最大元素
// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
// 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
// 示例 1:
// 输入: [3,2,1,5,6,4], k = 2
// 输出: 5
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

// var findKthLargest = function(nums, k) {
//   if (!nums || !nums.length) return
//   let i = 0
//   while (i < k) {
//     swim(i, nums)
//     i ++
//   }
//   for (var j = k; j < nums.length; j ++) {
//     var top = nums[0]
//     if (nums[j] > top) {
//       nums[0] = nums[j]
//       sink(nums, 0, k)
//     }
//   }
//   function swap(nums, i, j) {
//     var temp = nums[i]
//     nums[i] = nums[j]
//     nums[j] = temp
//   }
//   function swim(i, nums) {
//     while (i > 0 && nums[(i - 1) >> 1] > nums[i]) {
//       swap(nums, i, (i - 1) >> 1)
//       i = (i - 1) >> 1
//     }
//   }
//   function sink(nums, index, heapSize) {
//     while (true) {
//       let leftIndex = index * 2 + 1
//       let rightIndex = leftIndex + 1
//       let minIndex = index
//       if (leftIndex < heapSize && nums[index] > nums[leftIndex]) {
//         minIndex = leftIndex
//       }
//       if (rightIndex < heapSize && nums[minIndex] > nums[rightIndex]) {
//         minIndex = rightIndex
//       }
//       if (minIndex == index) break
//       swap(nums, index, minIndex)
//       index = minIndex
//     }
//   }
//   return nums[0]
// };

var findKthLargest = function(nums, k) {
  function swap(nums, i, j) {
    var temp = nums[i]
    nums[i] = nums[j]
    nums[j] = temp
  }
  
  function swim(index, nums) {
    while(true) {
      let parentIndex = (index - 1) >>> 1
      if (nums[index] < nums[parentIndex]) {
        swap(nums, index, parentIndex)
        index = parentIndex
      } else {
        break
      }
    }
  }

  function sink(index, nums, heapSize) {
    while(true) {
      let minIndex = index
      let leftIndex = 2 * minIndex + 1
      let rightIndex = leftIndex + 1
      if (leftIndex < heapSize && nums[minIndex] > nums[leftIndex]) {
        minIndex = leftIndex
      }
      if (rightIndex < heapSize && nums[minIndex] > nums[rightIndex]) {
        minIndex = rightIndex
      }
      if (minIndex === index) break
      swap(nums, minIndex, index)
      index = minIndex
    }
  }

  let index = 0
  while (index < k) {
    swim(index, nums)
    index ++
  }

  for (var j = k; j < nums.length; j ++) {
    const first = nums[0]
    if (nums[j] > first) {
      nums[0] = nums[j]
      sink(0, nums, k)
    }
  }

  return nums[0]
}