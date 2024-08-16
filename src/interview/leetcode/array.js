//双指针
//移除数组中某个元素或者去重 https://leetcode-cn.com/problems/remove-element/
//这个模板代码极为有用，特别是一定要在本数组上操作的情况
var removeElement = function(nums, val) {
  var len = nums.length
  if (!len) return 0
  var fast = 0,
    low = 0
  while (fast <= len - 1) {
    if (nums[fast] !== val) {
      nums[low] = nums[fast]
      low++
    }

    fast++
  }
  return low
}

//https://leetcode-cn.com/problems/move-zeroes/

var moveZeroes = function(nums) {
  if (!nums || !nums.length) return
  var len = nums.length
  var low = 0,
    fast = 0
  while (fast <= len - 1) {
    if (nums[fast] !== 0) {
      nums[low] = nums[fast]
      low++
    }
    fast++
  }
  for (var i = length - 1; i >= length - low - 2; i--) {
    nums[i] = 0
  }
  // while (low <= len - 1) {
  //   nums[low] = 0
  //   low ++
  // }
  return nums
}

//优化
var moveZeroes2 = function(nums) {
  if (!nums || !nums.length) return
  var len = nums.length
  var low = 0,
    fast = 0
  while (fast <= len - 1) {
    if (nums[fast] !== 0) {
      var temp = nums[low]
      nums[low] = nums[fast]
      nums[fast] = temp
      low++
    }
    fast++
  }
  return nums
}

//https://leetcode-cn.com/problems/intersection-of-two-arrays/submissions/
var intersection = function(nums1, nums2) {
  nums1 = nums1.sort((a, b) => a - b)
  nums2 = nums2.sort((a, b) => a - b)
  var index1 = 0,
    index2 = 0
  var intersections = []
  while (index1 < nums1.length && index2 < nums2.length) {
    if (nums1[index1] == nums2[index2]) {
      //这里的保证数据唯一性的操作很灵性
      if (!intersections.length || nums1[index1] !== intersections[intersections.length - 1])
        intersections.push(nums1[index1])
      index1++
      index2++
    } else if (nums1[index1] > nums2[index2]) {
      index2++
    } else {
      index1++
    }
  }
  return intersections
}

//https://leetcode-cn.com/problems/3sum/
//暴力解法
var threeSum = function(nums) {
  if (!nums || !nums.length) return []
  var end = []
  nums = nums.sort((a, b) => a - b)

  var preMap = new Map()

  var findThree = function(p, q, i, j, cur, nums) {
    var tupleNums = []
    while (p <= q) {
      var mid = Math.floor((p + q) / 2)
      if (cur + nums[mid] === 0) {
        var str = nums[i] + '' + nums[j] + '' + nums[mid]
        if (!preMap.get(str)) {
          tupleNums = [nums[i], nums[j], nums[mid]]
        }
        preMap.set(str, 1)
        return tupleNums
      } else if (cur + nums[mid] > 0) {
        q = mid - 1
      } else {
        p = mid + 1
      }
    }
  }

  for (var i = 0; i < nums.length - 1; i++) {
    var first = nums[i]
    for (var j = i + 1; j < nums.length; j++) {
      var second = nums[j]
      var sumTwo = first + second
      var tupleNums = findThree(j + 1, nums.length - 1, i, j, sumTwo, nums)
      if (tupleNums && tupleNums.length) {
        end.push(tupleNums)
      }
    }
  }
  return end
}

var threeSum2 = function(nums) {
  if (!nums || nums.length <= 2) return []
  nums = nums.sort((a, b) => a - b)
  var map = new Map()
  if (nums[0] > 0) return []
  var end = []
  for (var i = 0; i < nums.length - 2; i++) {
    var first = nums[i]
    if (i > 0 && nums[i] == nums[i - 1]) continue
    var p = i + 1,
      q = nums.length - 1
    while (p < q) {
      if (nums[p] + nums[q] == -first) {
        var key = first + '' + nums[p] + '' + nums[q]
        if (!map.get(key)) {
          end.push([first, nums[p], nums[q]])
        }
        p++
        q--
        map.set(key, 1)
      } else if (nums[p] + nums[q] < -first) {
        p++
      } else {
        q--
      }
    }
  }
  return end
}

//滑动窗口
var minWindow = function(s, t) {
  if (s.length < t.length) return ''
  var start = 0, prevMinStr = {
    length: Number.MAX_VALUE
  }, curStr = ''

  var isInclude = function(str, target) {
    for (var j = 0; j < target.length; j ++) {
      if (str.indexOf(target[i]) == -1) {
        return false
      }
    }
    return true
  }

  for (var i = 0; i < s.length; i ++) {
    curStr += s[i]
    let end = curStr.length
    while (isInclude(curStr, t)) {
      if (curStr.length < prevMinStr.length) {
        prevMinStr = curStr
      }
      console.log('curStr...', curStr)
      curStr = curStr.substr(start ++, end)
    }
  }
  return typeof prevMinStr === 'string' ? prevMinStr : ''
}

minWindow('ADOBECODEBANC', 'ABC')


