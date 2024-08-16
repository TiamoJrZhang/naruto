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
    let parentIndex = index - 1 >>> 1
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


