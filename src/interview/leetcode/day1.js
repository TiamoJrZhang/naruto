// 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
// 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
// 示例:
// 给定 nums = [2, 7, 11, 15], target = 9
// 因为 nums[0] + nums[1] = 2 + 7 = 9
// 所以返回 [0, 1]

//暴力法 O(n2)
var twoSum = function(nums, target) {
  for (var i = 0; i <= nums.length; i++) {
    for (var j = i + 1; j <= nums.length - 1; j++) {
      if (nums[i] + nums[j] == target) {
        return [i, j]
      }
    }
  }
}

//hash表
var twoSum = function(nums, target) {
  var hashMap = new Map()
  for (var i = 0; i < nums.length; i++) {
    hashMap.set(nums[i], i)
  }

  for (var j = 0; j < nums.length; j++) {
    var curItem = nums[j]
    var mapItem = target - curItem
    if (hashMap.get(mapItem) && hashMap.get(mapItem) != j) {
      return [j, hashMap.get(mapItem)]
    }
  }
}

//while循环
var twoSum = function(nums, target) {
  let map = {} //key数字 value下标
  let loop = 0 //循环次数
  let dis //目标与当前值的差
  while (loop < nums.length) {
    dis = target - nums[loop]
    if (map[dis] != undefined) {
      return [map[dis], loop]
    }
    map[nums[loop]] = loop
    loop++
  }
  return
}

// 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
// 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
// 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。
// 示例：
// 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
// 输出：7 -> 0 -> 8
// 原因：342 + 465 = 807

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  var sum = 0
  var add = 0
  var node = new ListNode(0)
  var temp = node
  while (l1 || l2) {
    var val1 = l1 ? l1.val : 0
    var val2 = l2 ? l2.val : 0
    sum = val1 + val2 + add
    add = sum >= 10 ? 1 : 0
    temp.next = new ListNode(sum % 10)
    temp = temp.next
    l1 && (l1 = l1.next)
    l2 && (l2 = l2.next)
  }
  if (add) {
    temp.next = new ListNode(add)
  }
  return node.next
}

// 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
// 示例 1:
// 输入: "abcabcbb"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
// 示例 2:
// 输入: "bbbbb"
// 输出: 1
// 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
// 示例 3:
// 输入: "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
// 请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
