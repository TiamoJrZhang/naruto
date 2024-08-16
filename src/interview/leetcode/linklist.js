// https://leetcode-cn.com/problems/reverse-linked-list/
//反转链表

var reverseList = function(head) {
  var pre = null
  var cur = head
  while (cur) {
    var temp = cur.next
    cur.next = pre
    pre = cur
    cur = temp
  }
  return pre
}

var reverseList2 = function(head) {
  if (!head || !head.next) return head
  var cur = reverseList2(head.next)
  head.next.next = head
  head.next = null
  return cur
}

//https://leetcode-cn.com/problems/linked-list-cycle/
//给定一个链表，判断链表中是否有环。
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */

//解法一
var hasCycle = function(head) {
  var map = new Map()
  while (head) {
    if (map.has(head)) return true
    map.set(head, head.val)
    head = head.next
  }
  return false
}

//解法二 快慢指针
var hasCycle2 = function(head) {
  var fast = head,
    slow = head

  while (fast && slow && fast.next) {
    fast = fast.next.next
    slow = slow.next
    if (!fast || !slow) return false
    if (fast.val == slow.val) return true
  }

  return false
}

// https://leetcode-cn.com/problems/middle-of-the-linked-list/
// 链表的中间结点

var middleNode = function(head) {
  if (!head) return
  var count = 0
  var arr = []
  while (head) {
    arr.push(head)
    head = head.next
  }
  var middle = Math.floor(arr.length / 2)
  return arr[middle]
}

//快慢指针
var middleNode2 = function(head) {
  var fast = head
  slow = head
  while (fast && fast.next) {
    fast = fast.next.next
    slow = slow.next
  }

  return slow
}

//将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
var mergeTwoLists = function(l1, l2) {
  if (!l2 && !l1) return null
  var newHead = new ListNode(-1)
  var prevNode = newHead

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      prevNode.next = l1
      l1 = l1.next
    } else {
      prevNode.next = l2
      l2 = l2.next
    }
    prevNode = prevNode.next
  }
  //不一定遍历完
  prevNode.next = l1 === null ? l2 : l1

  return newHead.next
};
