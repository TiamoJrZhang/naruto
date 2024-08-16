var jump = function(nums) {
  if (!nums || !nums.length) return
  var maxPos = 0
  var start = 0
  var end = 1
  var ans = 0
  while (end < nums.length) {
    for (var i = start; i < end; i++) {
      maxPos = Math.max(maxPos, i + nums[i])
    }
    start = end
    end = maxPos + 1
    ans++
  }
  return ans
}

jump([2, 3, 1, 1, 4])

var canJump = function(nums) {
  if (!nums || !nums.length) return false
  var maxPos = 0
  for (var i = 0; i <= maxPos; i++) {
    var pos = nums[i] + i
    maxPos = Math.max(pos, maxPos)
    if (maxPos >= nums.length - 1) {
      return true
    }
  }
  return false
}

canJump([2, 1, 3, 2, 4])

var wiggleMaxLength = function(nums) {
  if (!nums || !nums.length) return
  if (nums.length == 1) return 1
  if (nums.length == 2) return 2
  var ans = new Set()
  var next = 1
  if (nums[1] - nums[0] > 0) {
    for (var i = 1; i < nums.length; i++) {
      var substract = nums[i] - nums[i - 1]
      if (next & (i == 1) && substract > 0) {
        ans.add(nums[i])
        ans.add(nums[i - 1])
      }
      console.log('next & i == 0...', next, i, next & (i == 0))
      if (next & (i == 0) && substract < 0) {
        ans.add(nums[i])
        ans.add(nums[i - 1])
      }
    }
  }
  return ans.size
}

wiggleMaxLength([1, 7, 4, 9, 2, 5])
