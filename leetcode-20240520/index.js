// 发布订阅
class eventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(type, callback) {
    const events = this.events.get(type);
    if (!events) {
      this.events.set(type, [callback]);
    } else {
      events.push(callback);
    }
  }

  off(type, callback) {
    const events = this.events.get(type);
    if (!events) return;
    this.events.set(
      type,
      events.filter((e) => e !== callback)
    );
  }

  emit(type, ...reset) {
    const events = this.events.get(type);
    if (!events) return;
    events.forEach((fn) => {
      fn.apply(this, reset);
    });
  }

  once(type, callback) {
    function fn() {
      callback();
      this.off(type, callback);
    }

    this.on(type, fn);
  }
}

// 多维数组
function flatten(array) {
  if (!array || !array.length) return array;
  const flattedArr = [];
  function resur(array) {
    array.forEach((item) => {
      if (Array.isArray(item)) {
        resur(item);
      } else {
        flattedArr.push(item);
      }
    });
  }
  resur(array);
  return flattedArr;
}

function flatten1(array) {
  if (!array || !array.length) return array;
  return array.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flatten1(cur)] : [...pre, cur];
  }, []);
}

// 寄生组合
function Parent(name) {
  this.name = name;
  this.say = () => {
    console.log(111);
  };
}
Parent.prototype.play = () => {
  console.log(222);
};

function Child() {
  Parent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 实现有并行限制的 Promise 调度器
// 题目描述:JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个
class Scheduler {
  constructor(limit = 2) {
    this.queue = [];
    this.count = 0;
    this.limit = limit;
  }

  add(callback, timer, order) {
    const newCallback = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          callback();
          resolve();
        }, timer);
      });
    const queueItem = {
      callback: newCallback,
      order,
    };
    this.queue.push(queueItem);
  }

  doRun() {
    if (this.queue.length !== 0 && this.count <= this.limit) {
      const item = this.queue.shift();
      if (item && item.callback) {
        this.count++;
        Promise.resolve(item.callback()).then(() => {
          this.count--;
          this.doRun();
        });
      }
    }
  }

  run() {
    for (let index = 0; index < this.limit; index++) {
      this.doRun();
    }
  }
}

// const sch = new Scheduler(2)
// // sch.add(() => {
// //   console.log(1)
// // }, 1000)
// // sch.add(() => {
// //   console.log(2)
// // }, 500)
// // sch.add(() => {
// //   console.log(3)
// // }, 300)
// // sch.add(() => {
// //   console.log(4)
// // }, 400)

// sch.run()

// 手写 new 操作符实现
function newFn(fn, ...args) {
  const obj = Object.create(fn.prototype);
  const result = fn.call(obj, ...args);
  if (typeof result === "object" || typeof result === "function") return result;
  return obj;
}

Function.prototype.myCall = function (context, ...args) {
  if (!context) {
    context = window;
  }
  const key = new Symbol();
  context[key] = this;
  context[key](...args);
};

Function.prototype.myApply = function (context, args) {
  if (!context) {
    context = window;
  }
  const key = new Symbol();
  context[key] = this;
  context[key](...args);
};

Function.prototype.myBind = function (context, ...args) {
  if (!context) {
    context = window;
  }
  const key = new Symbol();
  const _this = this;
  context[key] = _this;

  const result = function (...innerArgs) {
    if (this instanceof _this) {
      this[key] = _this;
      this[key](...[...args, ...innerArgs]);
    } else {
      context[key](...[...args, ...innerArgs]);
    }
  };

  result.prototype = Object.create(_this.prototype);

  return result;
};

function deepClone(target, hash = new Map()) {
  if (typeof target !== "object" || target !== null) return target;
  if (hash.has(target)) return hash.get(target);

  const result = Array.isArray(target) ? [] : {};
  hash.set(target, result);

  Object.keys(target).forEach((key) => {
    const item = target[key];

    if (typeof item === "object" && item !== null) {
      result[key] = deepClone(item, hash);
    } else {
      result[key] = item;
    }
  });

  return result;
}

function myInstanceof(left, right) {
  while (true) {
    if (left === null) return false;
    if (left.__proto__ === right.prototype) {
      return true;
    }
    left = left.__proto__;
  }
}

function curry(fn, ...args) {
  let allArgsLen = [...args];
  const innerFn = function (...innerArgs) {
    allArgsLen = [...args, ...innerArgs];
    if (allArgsLen.length === fn.length) {
      return fn(...allArgsLen);
    } else {
      return innerFn;
    }
  };

  return innerFn;
}

function debounce(callback, delay) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function throttle(callback, delay) {
  let flag = true;

  return function (...args) {
    if (!flag) return;
    flag = false;
    let timer = setTimeout(() => {
      callback.apply(this, args);
      flag = true;
      clearTimeout(timer);
    }, delay);
  };
}

function all(promises) {
  const result = [];

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const p = promises[i];
      Promise.resolve(p).then(
        (val) => {
          result.push(val);

          if (i === promises.length - 1) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
}

// 算法
// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
var twoSum = function (nums, target) {
  if (!nums || !nums.length) return [];
  const numMap = new Map();
  for (let index = 0; index < nums.length; index++) {
    const item = nums[index];
    const subItem = target - item;
    if (numMap.has(subItem) && numMap.get(subItem) !== index) {
      return [index, numMap.get(subItem)];
    }
    numMap.set(item, index);
  }
};

// const result = twoSum([3,2,4], 6)
// console.log('result...', result)

// https://leetcode.cn/problems/group-anagrams/description/?envType=study-plan-v2&envId=top-100-liked
var groupAnagrams = function (strs) {
  if (!strs || !strs.length) return [];
  const strMap = new Map();
  const result = [];
  for (let index = 0; index < strs.length; index++) {
    const item = strs[index];
    const sortedStr = item.split("").sort().join("");

    const data = strMap.get(sortedStr);
    if (!data) {
      strMap.set(sortedStr, [item]);
    } else {
      data.push(item);
    }
  }

  strMap.forEach((val) => {
    result.push(val);
  });

  return result;
};

// console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]))

// https://leetcode.cn/problems/longest-consecutive-sequence/description/?envType=study-plan-v2&envId=top-100-liked

var quickSort = function (arr) {
  if (arr.length <= 1) return arr;
  var mid = Math.floor(arr.length / 2);
  var midNum = arr.splice(mid, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > midNum) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  return quickSort(left).concat([midNum], quickSort(right));
};

// var longestConsecutive = function(nums) {
//   if (!nums || !nums.length) return 0
//   nums = quickSort(Array.from(new Set(nums)))
//   if (nums.length === 1) return 1
//   const numMap = new Map()
//   let keyFlag = 0
//   let maxLen = 1
//   for (let index = 0; index < nums.length; index++) {
//     const num = nums[index];

//     if (!numMap.has(keyFlag)) numMap.set(keyFlag, [num])
//     const contiArr = numMap.get(keyFlag)
//     const lastItem = contiArr[contiArr.length - 1]
//     if (num - lastItem === 1) {
//       contiArr.push(num)
//       if (contiArr.length > maxLen) {
//         maxLen = contiArr.length
//       }
//     } else {
//       keyFlag ++
//       numMap.set(keyFlag, [num])
//     }
//   }
//   return maxLen
// };

var longestConsecutive = function (nums) {
  if (!nums || !nums.length) return 0;
  const set = new Set();
  for (const num of nums) {
    set.add(num);
  }
  var ans = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      var currentNum = num;
      var currentLen = 1;
      while (set.has(currentNum + 1)) {
        currentNum = currentNum + 1;
        currentLen = currentLen + 1;
      }
      ans = Math.max(ans, currentLen);
    }
  }
  return ans;
};

// console.log(longestConsecutive([-6,-1,-1,9,-8,-6,-6,4,4,-3,-8,-1]))

var moveZeroes = function (nums) {
  if (!nums || nums.length <= 1) return nums;

  var low = 0,
    fast = 0;

  while (fast < nums.length) {
    if (nums[fast] !== 0) {
      const temp = nums[fast];
      nums[fast] = nums[low];
      nums[low] = temp;
      low++;
    }

    fast++;
  }

  return nums;
};

console.log(moveZeroes([0, 1, 0, 3, 12]));

var search = function (nums, target) {
  if (!nums || nums.length <= 1) return nums;
  var left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (target < nums[mid]) {
      right = mid - 1;
    } else if (target > nums[mid]) {
      left = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
};

// https://leetcode.cn/problems/container-with-most-water/?envType=study-plan-v2&envId=top-100-liked
var maxArea = function (height) {
  var left = 0,
    right = height.length - 1;
  max = 0;

  while (left <= right) {
    const x = right - left;
    const y = Math.min(height[right], height[left]);
    max = Math.max(x * y, max);
    console.log(left, right);
    if (height[right] > height[left]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
};

// console.log('maxArea([6,8,6,2,5,4,8,3,7])', maxArea([6,8,6,2,5,4,8,9,7]))

// https://leetcode.cn/problems/3sum/description/?envType=study-plan-v2&envId=top-100-liked

// 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。
// 请你返回所有和为 0 且不重复的三元组。
// 示例 1：
// 输入：nums = [-1,0,1,2,-1,-4]
// 输出：[[-1,-1,2],[-1,0,1]]
// 解释：
// nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
// nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
// nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
// 不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
// 注意，输出的顺序和三元组的顺序并不重要。
var threeSum = function (nums) {
  if (!nums || !nums.length) return [];
  nums = nums.sort((a, b) => a - b);
  const result = [];
  for (var i = 0; i < nums.length; i++) {
    var curNum = nums[i];
    var left = i + 1,
      right = nums.length - 1;
    if (i > 0 && curNum === nums[i - 1]) continue;
    while (left < right) {
      var sum = curNum + nums[left] + nums[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([curNum, nums[left], nums[right]]);
        left++;
        right--;
        while (nums[left] === nums[left - 1]) {
          left++;
        }
        while (nums[right] === nums[right + 1]) {
          right--;
        }
      }
    }
  }
  return result;
};

// console.log("threeSum([[-2,0,0,2,2]])..", threeSum([-2, 0, 0, 2, 2]));

// https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/?envType=study-plan-v2&envId=top-100-liked
//给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串的长度。
// 示例 1:
// 输入: s = "abcabcbb"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

var lengthOfLongestSubstring = function (s) {
  let maxLen = 0;
  if (!s || !s.length) return maxLen;
  let set = new Set(),
    left = 0;

  for (var i = 0; i < s.length; i++) {
    while (set.has(s[i])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[i]);
    maxLen = Math.max(maxLen, set.size);
  }
  return maxLen;
};

// console.log("...", lengthOfLongestSubstring("abcabcbb"));

// https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/?envType=study-plan-v2&envId=top-100-liked
// 输入: s = "cbaebabacd", p = "abc"
// 输出: [0,6]
// 解释:
// 起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
// 起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。

// function findAnagrams(s, t) {
//   let need = new Map();
//   let window = new Map();

//   for (let char of t) {
//     if (need.has(char)) {
//       need.set(char, need.get(char) + 1);
//     } else {
//       need.set(char, 1);
//     }
//   }

//   let left = 0,
//     right = 0;
//   let valid = 0;
//   let res = [];

//   while (right < s.length) {
//     let c = s[right];
//     right++;

//     if (need.has(c)) {
//       if (window.has(c)) {
//         window.set(c, window.get(c) + 1);
//       } else {
//         window.set(c, 1);
//       }
//       if (window.get(c) === need.get(c)) {
//         valid++;
//       }
//     }

//     while (right - left >= t.length) {
//       if (valid === need.size) {
//         res.push(left);
//       }

//       let d = s[left];
//       left++;

//       if (need.has(d)) {
//         if (window.get(d) === need.get(d)) {
//           valid--;
//         }
//         window.set(d, window.get(d) - 1);
//       }
//     }
//   }

//   return res;
// }

function findAnagrams(s, t) {
  let need = new Map();
  let window = new Map();

  for (str of t) {
    if (!need.has(str)) {
      need.set(str, 1);
    } else {
      need.set(str, need.get(str) + 1);
    }
  }

  let right = 0,
    left = 0,
    valid = 0,
    result = [];

  while (right < s.length) {
    const curItem = s[right];

    if (need.has(curItem)) {
      if (!window.has(curItem)) {
        window.set(curItem, 1);
      } else {
        window.set(curItem, window.get(curItem) + 1);
      }

      if (window.get(curItem) === need.get(curItem)) {
        valid++;
      }
    }

    // console.log('valid...', valid, right, left, curItem)
    if (right - left >= t.length - 1) {
      const lItem = s[left];

      if (valid === need.size) {
        result.push(left);
      }

      if (window.has(lItem)) {
        if (window.get(lItem) === need.get(lItem)) {
          valid--;
        }
        window.set(lItem, window.get(lItem) - 1);
      }
      left++;
    }

    right++;
  }

  return result;
}

// console.log("findAnagrams..", findAnagrams("baa", "aa"));

// 给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。
// 子数组是数组中元素的连续非空序列。
// 示例 1：
// 输入：nums = [1,1,1], k = 2
// 输出：2

// 示例 2：
// 输入：nums = [1,2,3], k = 3
// 输出：2
// https://leetcode.cn/problems/subarray-sum-equals-k/?envType=study-plan-v2&envId=top-100-liked

// var sum = function(nums) {
//   let result = 0
//   let i = 0
//   while (i < nums.length) {
//     result = result + nums[i]
//     i ++
//   }
//   return result
// }

// var find = function(nums, target) {
//   let left = 0,
//     right = nums.length

//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2)
//     const midVal = nums[mid]

//     if (target > midVal) {
//       left = mid + 1
//     } else if (target < midVal) {
//       right = mid - 1
//     } else {
//       return mid
//     }
//   }

//   return -1
// }

var subarraySum = function (nums, k) {
  if (!nums || !nums.length) return 0;

  let count = 0;
  for (var i = 0; i < nums.length; i++) {
    let sum = 0;
    for (var j = i; j < nums.length; j++) {
      sum = sum + nums[j];
      if (sum === k) {
        count++;
      }
    }
  }

  return count;
};

console.log(subarraySum([1, 2, 3, 4, 5, 6, 7], 6));

// https://leetcode.cn/problems/maximum-subarray/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
// 子数组
// 是数组中的一个连续部分。

// 示例 1：
// 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出：6
// 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。

// var maxSubArray = function(nums) {
//   if (!nums || !nums.length) return 0
//   let max = Number.MIN_SAFE_INTEGER;
//   for (var i = 0; i < nums.length; i ++) {
//     let sum = 0;
//     for (var j = i; j < nums.length; j ++) {
//       sum = sum + nums[j]
//       max = Math.max(max, sum)
//     }
//   }
//   return max;
// };

// dp[i] = max(dp[i-1] + nums[i], num[i]);
var maxSubArray = function (nums) {
  if (!nums || !nums.length) return 0;
  let max = nums[0];
  let dp = [];
  dp[0] = nums[0];

  for (var i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);

    if (max < dp[i]) max = dp[i];
  }

  return max;
};

console.log("subarraySum..", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

const arrayToLink = function (array) {
  let head = new ListNode(array[0]);
  let curNode = null;
  let prevNode = head;

  for (var i = 1; i < array.length; i++) {
    curNode = new ListNode(array[i]);
    prevNode.next = curNode;
    prevNode = curNode;
  }

  return head;
};

// https://leetcode.cn/problems/intersection-of-two-linked-lists/description/?envType=study-plan-v2&envId=top-100-liked
// 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

var getIntersectionNode = function (headA, headB) {
  if (headA === null || headB === null) return null;

  var pA = headA,
    pB = headB;

  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }

  return pA;
};

// https://leetcode.cn/problems/reverse-linked-list/?envType=study-plan-v2&envId=top-100-liked

// var reverseList = function(head) {
//   if (!head || !head.next) return head

//   const newHead = reverseList(head.next)
//   head.next.next = head
//   head.next = null

//   return newHead
// };

var reverseList = function (head) {
  if (!head) return head;

  var prev = null;
  var cur = head;

  while (cur) {
    var next = cur.next ? cur.next : null;
    // next.next = cur
    cur.next = prev;
    prev = cur;
    cur = next;
  }

  return prev;
};

//给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
var isPalindrome = function (head) {
  let newHead = reverseList(head);
  if (head === null && newHead === null) return true;
  if (head === null || newHead === null) return false;
  while (head && newHead) {
    if (head.val !== newHead.val) {
      return false;
    }
    head = head.next;
    newHead = newHead.next;
  }
  return true;
};

console.log("isPalindrome", isPalindrome(arrayToLink([1, 1, 2, 1])));

// https://leetcode.cn/problems/linked-list-cycle/?envType=study-plan-v2&envId=top-100-liked
var hasCycle = function (head) {
  var low = head,
    fast = head;

  while (fast) {
    if (!fast || !fast.next) return false;
    low = low.next;
    fast = fast.next.next;

    if (fast === low) return true;
  }

  return false;
};

// https://leetcode.cn/problems/merge-two-sorted-lists/description/?envType=study-plan-v2&envId=top-100-liked
// 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
// 输入：l1 = [1,2,4], l2 = [1,3,4]
// 输出：[1,1,2,3,4,4]

var mergeTwoLists = function (list1, list2) {
  if (list1 === null && list2 === null) return null;
  if (list2 === null && list1) return list1;
  if (list1 === null && list2) return list2;

  const newHead = new ListNode(-1);
  let prevNode = newHead;
  while (list1 && list2) {
    if (list1.val > list2.val) {
      prevNode.next = list2;
      prevNode = list2;
      list2 = list2.next;
    } else {
      prevNode.next = list1;
      prevNode = list1;
      list1 = list1.next;
    }
  }
  if (list1 === null) prevNode.next = list2;
  if (list2 === null) prevNode.next = list1;
  return newHead.next;
};

// https://leetcode.cn/problems/linked-list-cycle-ii/?envType=study-plan-v2&envId=top-100-liked
// var detectCycle = function(head) {
//   const map = new Map()
//   let index = 0
//   while (head) {
//     if (!map.has(head)) {
//       map.set(head, index)
//     } else {
//       return head
//     }
//     head = head.next
//     index ++
//   }
//   return null
// };

// https://leetcode.cn/problems/add-two-numbers/solutions/435246/liang-shu-xiang-jia-by-leetcode-solution/?envType=study-plan-v2&envId=top-100-liked
// 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
// 请你将两个数相加，并以相同形式返回一个表示和的链表。
// 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
// 输入：l1 = [2,4,3], l2 = [5,6,4]
// 输出：[7,0,8]
// 解释：342 + 465 = 807.

// 输入：l1 = [0], l2 = [0]
// 输出：[0]

// 输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
// 输出：[8,9,9,9,0,0,0,1]

var addTwoNumbers = function (l1, l2) {
  if (l1 === null && l2 === null) return null;
  if (l2 === null && l1) return l1;
  if (l1 === null && l2) return l2;

  let temp = 0;
  const newHead = new ListNode(-1);
  let prevNode = newHead;

  while (l1 || l2) {
    let result = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + temp;
    const curNode = new ListNode(-1);
    if (result >= 10) {
      result = result % 10;
      temp = 1;
    } else {
      temp = 0;
    }
    curNode.val = result;
    prevNode.next = curNode;
    prevNode = curNode;
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }

  if (temp === 1) {
    prevNode.next = new ListNode(1);
  }
  // if (l1 === null) prevNode.next = l2
  // if (l2 === null) prevNode.next = l1

  return newHead.next;
};

// https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
// 输入：head = [1,2,3,4,5], n = 2
// 输出：[1,2,3,5]
var removeNthFromEnd = function (head, n) {
  if (head === null) return head;
  let newHead = new ListNode(-1, head);
  let tempNewHead = newHead;
  let tempHead = head;
  let index = 0;
  let length = 0;
  while (tempHead) {
    tempHead = tempHead.next;
    length++;
  }

  while (tempNewHead) {
    if (index === length - n) {
      tempNewHead.next = tempNewHead.next ? tempNewHead.next.next : null;
      return newHead.next;
    }
    tempNewHead = tempNewHead.next;
    index++;
  }

  return newHead.next;
};

console.log(
  "removeNthFromEnd(arrayToLink([1,2,3,4,5]), 1)...",
  removeNthFromEnd(arrayToLink([1]), 1)
);

// 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
// 输入：head = [1,2,3,4]
// 输出：[2,1,4,3]
var swapPairs = function (head) {
  if (!head || !head.next) return head;

  const newHead = new ListNode(-1, head);

  let low = head,
    fast = head.next;
  prevNode = newHead;

  while (fast && low) {
    const fastNext = fast.next;
    fast.next = low;
    low.next = fastNext;
    prevNode.next = fast;
    prevNode = low;

    fast = prevNode.next ? prevNode.next.next : null;
    low = prevNode.next ? prevNode.next : null;
  }

  return newHead.next;
};

console.log("swapPairs...", swapPairs(arrayToLink([1, 2, 3, 4])));

// https://leetcode.cn/problems/copy-list-with-random-pointer/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。
// 构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点 。
// 例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --> Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random --> y 。
// 返回复制链表的头节点。
// 用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示：
// val：一个表示 Node.val 的整数。
// random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为  null 。
// 你的代码 只 接受原链表的头节点 head 作为传入参数。

// 输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
// 输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]

var copyRandomList = function (head) {
  if (head === null) return head;
  const map = new Map();
  const newHead = new Node(-1);
  let prevNode = newHead;
  let tempHead = head;

  while (tempHead) {
    const newNode = new Node(tempHead.val);
    map.set(tempHead, newNode);
    prevNode.next = newNode;
    prevNode = newNode;
    tempHead = tempHead.next;
  }

  tempHead = head;
  prevNode = newHead.next;

  while (tempHead && prevNode) {
    prevNode.random = tempHead.random ? map.get(tempHead.random) : null;
    tempHead = tempHead.next;
    prevNode = prevNode.next;
  }

  return newHead.next;
};

// https://leetcode.cn/problems/sort-list/description/?envType=study-plan-v2&envId=top-100-liked
// 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。
// 输入：head = [4,2,1,3]
// 输出：[1,2,3,4]

var sortList = function (head) {};

// https://leetcode.cn/problems/reverse-nodes-in-k-group/description/?envType=study-plan-v2&envId=top-100-liked
// 给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。
// k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。
// 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
// 输入：head = [1,2,3,4,5], k = 2
// 输出：[2,1,4,3,5]
var reverseList2 = function (head, k) {
  var prev = null;
  var cur = head;
  var count = 0;

  while (cur) {
    if (count === k) {
      return [prev, head, cur];
    }
    var next = cur.next ? cur.next : null;
    cur.next = prev;
    prev = cur;
    cur = next;
    count++;
  }

  return [prev, head, cur];
};

var reverseKGroup = function (head, k) {
  if (head === null) return null;
  let count = 1;
  let newHead = new ListNode(-1);
  let prevNode = newHead;
  let tempHead = head;

  while (tempHead) {
    if (count !== 0 && count % k === 0) {
      const [reverseNode, lastNode, nextNode] = reverseList2(head, k);
      lastNode.next = nextNode;
      prevNode.next = reverseNode;
      prevNode = lastNode;
      tempHead = nextNode;
      head = nextNode;
    } else {
      tempHead = tempHead.next;
    }
    count++;
  }

  return newHead.next;
};

console.log(
  "reverseKGroup...",
  JSON.stringify(reverseKGroup(arrayToLink([1, 2, 3, 4, 5]), 2))
);

// https://leetcode.cn/problems/merge-k-sorted-lists/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个链表数组，每个链表都已经按升序排列。
// 请你将所有链表合并到一个升序链表中，返回合并后的链表。
// 输入：lists = [[1,4,5],[1,3,4],[2,6]]
// 输出：[1,1,2,3,4,4,5,6]
// 解释：链表数组如下：
// [
//   1->4->5,
//   1->3->4,
//   2->6
// ]
// 将它们合并到一个有序链表中得到。
// 1->1->2->3->4->4->5->6

var mergeTwoLists = function (list1, list2) {
  if (list1 === null && list2 === null) return null;
  if (list2 === null && list1) return list1;
  if (list1 === null && list2) return list2;

  const newHead = new ListNode(-1);
  let prevNode = newHead;
  while (list1 && list2) {
    if (list1.val > list2.val) {
      prevNode.next = list2;
      prevNode = list2;
      list2 = list2.next;
    } else {
      prevNode.next = list1;
      prevNode = list1;
      list1 = list1.next;
    }
  }
  if (list1 === null) prevNode.next = list2;
  if (list2 === null) prevNode.next = list1;
  return newHead.next;
};

var mergeKLists = function (lists) {
  if (!lists || !lists.length) return null;
  let prevList = lists[0];
  for (var i = 1; i < lists.length; i++) {
    prevList = mergeTwoLists(prevList, lists[i]);
  }
  return prevList;
};

console.log(
  "mergeKLists...",
  mergeKLists([
    arrayToLink([1, 4, 5]),
    arrayToLink([1, 3, 4]),
    arrayToLink([2, 6]),
  ])
);

// https://leetcode.cn/problems/lru-cache/?envType=study-plan-v2&envId=top-100-liked
// 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
// 实现 LRUCache 类：
// LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。
// 如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
// 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
// 示例：
// 输入
// ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
// [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
// 输出
// [null, null, null, 1, null, -1, null, -1, 3, 4]
// 解释
// LRUCache lRUCache = new LRUCache(2);
// lRUCache.put(1, 1); // 缓存是 {1=1}
// lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
// lRUCache.get(1);    // 返回 1
// lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
// lRUCache.get(2);    // 返回 -1 (未找到)
// lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
// lRUCache.get(1);    // 返回 -1 (未找到)
// lRUCache.get(3);    // 返回 3
// lRUCache.get(4);    // 返回 4

var LinkNode = function (key, val) {
  this.key = key;
  this.val = val;
};

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.head = new LinkNode(-1);
    this.tail = new LinkNode(-1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.map = new Map();
  }

  moveToHead(node) {
    const headNext = this.head.next;
    this.head.next = node;
    node.prev = this.head;

    node.next = headNext;
    headNext.prev = node;
  }

  deleteNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  get(key) {
    if (this.map.has(key)) {
      const targetNode = this.map.get(key);
      this.deleteNode(targetNode);
      this.moveToHead(targetNode);
      return targetNode.val;
    }

    return -1;
  }

  put(key, val) {
    let tagetNode = null;
    if (!this.map.has(key)) {
      tagetNode = new LinkNode(key, val);
      if (this.map.size === this.capacity) {
        const prevTail = this.tail.prev;
        this.map.delete(prevTail.key);
        this.deleteNode(prevTail);
      }
      this.map.set(key, tagetNode);
    } else {
      tagetNode = this.map.get(key);
      tagetNode.val = val;
      this.deleteNode(tagetNode);
    }

    this.moveToHead(tagetNode);
  }
}

// [[1],[2,1],[2],[3,2],[2],[3]]
// [[2],[2],[2,6],[1],[1,5],[1,2],[1],[2]]
const lru = new LRUCache(2);
// lru.put(1, 1)
// lru.put(2, 2)
// lru.get(1)
// lru.put(3, 3)
// lru.get(2)
// lru.put(4, 4)
// lru.get(1)
// lru.get(3)
// lru.get(4)

// lru.get(1)

lru.get(2);
lru.put(2, 6);
lru.get(1);
lru.put(1, 5);
lru.put(1, 2);
lru.get(1);
// lru.get(2)
// lru.get(2)
// lru.get(3)

console.log("lru.get(2)11...", lru.get(2));

var aTree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: {
      val: 5,
      left: {
        val: 7,
      },
      right: {
        val: 8,
      },
    },
  },
  right: {
    val: 3,
    right: {
      val: 6,
    },
  },
};

// var inorderTraversal = function(root) {
//   if (!root) return []
//   var result = []
//   var dfs = function(root) {
//     if (!root) return
//     dfs(root.left)
//     result.push(root.val)
//     dfs(root.right)
//   }
//   dfs(root)
//   return result
// };

function inorderTraversal(root) {
  if (!root) return [];
  const stack = [];
  const result = [];
  let currentNode = root;
  while (currentNode || stack.length) {
    while (currentNode) {
      stack.push(currentNode);
      currentNode = currentNode.left;
    }
    currentNode = stack.pop();
    result.push(currentNode.val);
    currentNode = currentNode.right;
  }
  return result;
}

// [ 4, 2, 7, 5, 8, 1, 3, 6 ]
// console.log('inorderTraversal...', inorderTraversal(aTree))

// function frontInorderTraversal(root) {
//   const result = []
//   if (!root) return result

//   function dfs(root) {
//     if (!root) return
//     result.push(root.val)
//     dfs(root.left)
//     dfs(root.right)
//   }

//   dfs(root)

//   return result
// }
function preorderTraversal(root) {
  if (!root) return []
  const stack = []
  const result = []

  while (stack.length || root) {
    if (root) {
      stack.push(root)
      result.push(root.val)
      root = root.left
    } else {
      root = stack.pop()
      root = root.right
    }
  }

  return result
}


function inOrderTraversal(root) {
  if (!root) return []
  const stack = []
  const result = []

  while (stack.length || root) {
    if (root) {
      stack.push(root)
      root = root.left
    } else {
      root = stack.pop()
      result.push(root.val)
      root = root.right
    }
  }

  return result
}

// function behandOrderTraversal(root) {
//   const result = []
//   if (!root) return result

//   function dfs(root) {
//     if (!root) return
//     dfs(root.left)
//     dfs(root.right)
//     result.push(root.val)
//   }

//   dfs(root)

//   return result
// }

// function postorderTraversal(root) {
//   if (!root) return [];
//   const stack = [root];
//   const result = [];
//   while (stack.length) {
//     const node = stack.pop();
//     result.unshift(node.val);
//     if (node.left) stack.push(node.left);
//     if (node.right) stack.push(node.right);
//   }
//   return result;
// }

function postorderTraversal(root) {
  if (!root) return []
  const stack = []
  const result = []
  let lastVisitedNode = null

  while (stack.length || root) {
    if (root) {
      stack.push(root)
      root = root.left
    } else {
      const peekNode = stack[stack.length - 1]; // 获取栈顶节点但不出栈
      if (peekNode.right && peekNode.right !== lastVisitedNode) {
        root = peekNode.right;
      } else {
        result.push(peekNode.val); // 当前节点加入结果数组
        lastVisitedNode = stack.pop(); // 出栈并记录上一次访问的节点
      }
    }
  }

  return result
}

// [
//   4, 7, 8, 5,
//   2, 6, 3, 1
// ]

// https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/?envType=study-plan-v2&envId=top-100-liked
var maxDepth = function(root) {
  let maxDep = 0

  function dfs(root, count) {
    if (!root) {
      return
    }
    count = count + 1
    maxDep = Math.max(count, maxDep)
    dfs(root.left, count)
    dfs(root.right, count)
  }

  dfs(root, maxDep)

  return maxDep
};

console.log("maxDepth...", maxDepth(aTree));

// https://leetcode.cn/problems/invert-binary-tree/description/?envType=study-plan-v2&envId=top-100-liked
var invertTree = function(root) {
  if (!root) return null
  const left = root.left
  root.left = invertTree(root.right)
  root.right = invertTree(left)

  return root
};

// https://leetcode.cn/problems/symmetric-tree/description/?envType=study-plan-v2&envId=top-100-liked
var isSymmetric = function(root) {
  function symmetric(p1, p2) {
    if (p1 === null && null === p2) return true
    if (p1 === null || p2 === null) return false
    if (p1.val !== p2.val) return false
    return symmetric(p1.left, p2.right) && symmetric(p1.right, p2.left)
  }

  return symmetric(root, root)
};

// https://leetcode.cn/problems/diameter-of-binary-tree/description/?envType=study-plan-v2&envId=top-100-liked

// 给你一棵二叉树的根节点，返回该树的 直径 。

// 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。

// 两节点之间路径的 长度 由它们之间边数表示。
var diameterOfBinaryTree = function(root) {
  function maxDepth(root) {
    if (!root) return

    
  }
};

// https://leetcode.cn/problems/binary-tree-level-order-traversal/?envType=study-plan-v2&envId=top-100-liked
// 输入：root = [3,9,20,null,null,15,7]
// 输出：[[3],[9,20],[15,7]]

var levelOrder = function(root) {
  if (!root) return []
  const ans = []
  const queue = [root]
  let index = 0
  while (queue.length) {
    const length = queue.length
    for (var i = 0; i < length; i ++) {
      const item = queue.shift()
      if (!item) continue
      if (!ans[index]) ans[index] = []
      ans[index].push(item.val)
      if (item.left) {
        queue.push(item.left)
      }
      if (item.right) {
        queue.push(item.right)
      }
    }   
    
    index ++
  }

  return ans
};

//https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/description/?envType=study-plan-v2&envId=top-100-liked
var sortedArrayToBST = function(nums) {
  if (!nums || !nums.length) return null
  var index = Math.floor(nums.length / 2)
  var root = new TreeNode(nums[index]) 

  root.left = sortedArrayToBST(nums.slice(0, index))
  root.right = sortedArrayToBST(nums.slice(index + 1, nums.length))

  return root
};

// https://leetcode.cn/problems/validate-binary-search-tree/?envType=study-plan-v2&envId=top-100-liked
// 中序遍历为升序
function isValidBST(root) {
  let prev = Number.MIN_SAFE_INTEGER
  let flag = true
  function helper(root) {
    if (!root) return
    helper(root.left)
    if (prev >= root.val) flag = false
    prev = root.val
    helper(root.right)
  }

  helper(root)
  return flag
}

// https://leetcode.cn/problems/kth-smallest-element-in-a-bst/description/?envType=study-plan-v2&envId=top-100-liked
var kthSmallest = function(root, k) {
  const ans = []
  function helper(root) {
    if (!root) return
    helper(root.left)
    ans.push(root.val)
    helper(root.right)
  }

  helper(root)

  return ans[k - 1]
};

// https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/?envType=study-plan-v2&envId=top-100-liked
// 给你二叉树的根结点 root ，请你将它展开为一个单链表：
// 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
// 展开后的单链表应该与二叉树 先序遍历 顺序相同。
var flatten = function(root) {
  if (!root) return
  const right = root.right
  const left = root.left
  
  root.right = left
  root.left = null
  // let p = left
  // // if (p) {
  // //   while (p.right) {
  // //     p = p.right 
  // //   }
  // //   p.right = right
  // // }
  var p = root
  while(p.right !== null) {
    p = p.right
  }
  p.right = right
  flatten(root.left)
  flatten(root.right)
};

// https://leetcode.cn/problems/binary-tree-right-side-view/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
var rightSideView = function(root) {
  let level = 0
  let view = []
  function helper(root, level) {
    if (!root) return
    view[level] = root.val
    helper(root.left, level + 1)
    helper(root.right, level + 1)
  }
  helper(root, level)

  return view
};

// https://leetcode.cn/problems/path-sum-iii/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
// 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
var pathSum = function(root, targetSum) {
  
};