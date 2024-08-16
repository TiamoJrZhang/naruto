var array = [6, 4, 3, 5, 8, 7]
//冒泡
function bubbleSort() {
  if (!array || !array.length) return
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array.length - 1 - i; j++) {
      var temp = array[j + 1]
      if (temp < array[j]) {
        array[j + 1] = array[j]
        array[j] = temp
      }
    }
  }
  console.log('array...', array)
  return array
}

//冒泡排序优化
//**改进冒泡排序：
//**设置一标志性变量pos,用于记录每趟排序中最后一次进行交换的位置。由于pos位置之后的记录均已交换到位,故在进行下一趟排序时只要扫描到pos位置即可。
function bubbleSort2() {
  if (!array || !array.length) return
  var i = array.length - 1
  while (i > 0) {
    var pos = 0
    for (var j = 0; j < i; j++) {
      var temp = array[j]
      if (temp > array[j + 1]) {
        array[j] = array[j + 1]
        array[j + 1] = temp
        pos = j
      }
    }
    i = pos
  }
  console.log('array...', array)
  return array
}

//选择排序
function selectionSort() {
  if (!array || !array.length) return
  var minIndex, temp
  for (var i = 0; i < array.length - 1; i++) {
    temp = array[i]
    minIndex = i
    for (var j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j
      }
    }
    array[i] = array[minIndex]
    array[minIndex] = temp
  }

  console.log('array...', array)
  return array
}

//插入排序
function insertSort() {
  if (!array || !array.length) return

  for (var i = 1; i < array.length; i++) {
    var val = array[i]
    var j = i - 1
    while (j >= 0 && array[j] > val) {
      array[j + 1] = array[j]
      j--
    }
    array[j + 1] = val
  }
  console.log('array...', array)
  return array
}

//插入排序，二分法优化
function binaryInsertionSort(array) {
  if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
    for (var i = 1; i < array.length; i++) {
      var key = array[i],
        left = 0,
        right = i - 1
      while (left <= right) {
        var middle = parseInt((left + right) / 2)
        if (key < array[middle]) {
          right = middle - 1
        } else {
          left = middle + 1
        }
      }
      // 把left后面的所有数据往前推
      for (var j = i - 1; j >= left; j--) {
        array[j + 1] = array[j]
      }
      // 替换left的数据为key
      array[left] = key
    }

    return array
  } else {
    return 'array is not an Array!'
  }
}

function shellSort(array) {
  if (!array || !array.length) return
  const gap = 1
  while (gap < array.length / 3) {
    gap = gap * 3 + 1
  }
  for (gap; gap > 0; gap = Math.floor(gap / 3)) {
    for (var i = gap; i < len; i++) {
      temp = arr[i]
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j]
      }
      arr[j + gap] = temp
    }
  }
}

//归并排序
function mergeSort(arr = array) {
  //采用自上而下的递归方法
  var len = arr.length
  if (len < 2) {
    return arr
  }
  var middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle)
  var sortedLeft = mergeSort(left)
  var sortedRight = mergeSort(right)
  return merge(sortedLeft, sortedRight)
}

function merge(left, right) {
  var result = []
  console.time('归并排序耗时')
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }

  while (left.length) result.push(left.shift())

  while (right.length) result.push(right.shift())
  console.timeEnd('归并排序耗时')
  console.log('result...', result)
  return result
}

var quickSort = function(arr) {
  if (arr.length <= 1) {
    return arr
  }
  var pivotIndex = Math.floor(arr.length / 2)
  var pivot = arr.splice(pivotIndex, 1)[0]
  var left = []
  var right = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

var insertSort = function(array) {
  if (!array || !array.length) return
  for (var i = 1; i < array.length; i++) {
    var j = i - 1
    var temp = array[i]
    while (j >= 0) {
      if (array[j] > temp) {
        array[j + 1] = array[j]
        array[j] = temp
      }
      j--
    }
  }
  return array
}

const funcs = {
  bubbleSort,
  bubbleSort2,
  shellSort,
  insertSort,
  selectionSort,
  insertSortOptimize,
  mergeSort,
  quickSort,
}

funcs[process.argv[process.argv.length - 1]]()
