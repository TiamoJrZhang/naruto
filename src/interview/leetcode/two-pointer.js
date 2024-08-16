//https://leetcode-cn.com/problems/merge-sorted-array/
var merge = function(nums1, m, nums2, n) {
  var p = 0, q = 0
  var sorted = []
  var cur
  while (p < m || q < n) {
    if (p == m) {
      cur = nums2[q ++]
    } else if (q == n) {
      cur = nums1[p ++]
    } else if (nums1[p] < nums2[q]) {
      cur = nums1[p ++]  
    } else {
      cur = nums2[q ++]
    }
    sorted[p + q - 1] = cur
  }
  for (var i = 0; i < sorted.length; i ++) {
    nums1[i] = sorted[i]
  }
};


/**
 * 下一个排列，需要特殊的方法https://leetcode-cn.com/problems/next-permutation/solution/xia-yi-ge-pai-lie-suan-fa-xiang-jie-si-lu-tui-dao-/
 * 需要留意
 **/
