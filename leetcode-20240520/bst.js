// https://leetcode.cn/problems/binary-tree-inorder-traversal/?envType=study-plan-v2&envId=top-100-liked

function inorderTraversal(root) {
  if (!root) return []
  const stack = []
  const result = []

  while (root || stack.length) {
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

// https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个二叉树 root ，返回其最大深度。
// 二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。
var maxDepth = function(root) {
  let maxDep = 0
  function dfs(root, level) {
    if (!root) return
    maxDep = Math.max(maxDep, level)
    dfs(root.left, level + 1)
    dfs(root.right, level + 1)
  }

  dfs(root, 1)

  return maxDep
}

// https://leetcode.cn/problems/binary-tree-level-order-traversal/description/?envType=study-plan-v2&envId=top-100-liked
// 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。
var levelOrder = function(root) {
  const queue = [root]
  const result = []
  let index = 0
  while (queue.length) {
    const len = queue.length

    for (var i = 0; i < len; i ++) {
      const item = queue.shift()
      if (!item) continue
      if (!result[index]) result[index] = []
      result[index].push(item.val)
      if (item.left) queue.push(item.left)
      if (item.right) queue.push(item.right)
    }

    index ++
  }

  return result
}

// https://leetcode.cn/problems/diameter-of-binary-tree/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一棵二叉树的根节点，返回该树的 直径 。
// 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。
// 两节点之间路径的 长度 由它们之间边数表示。
// 当前节点的最长路径 rootDepth = maxDepth(root.left) + maxDepth(root.right)
var diameterOfBinaryTree = function(root) {
  let max = 0
  function maxDepth(root) {
    if (!root) return 0
    const leftMaxthDepth = maxDepth(root.left)
    const rightMaxthDepth = maxDepth(root.right)
    max = Math.max(max, leftMaxthDepth + rightMaxthDepth)
    return Math.max(leftMaxthDepth, rightMaxthDepth) + 1
  }

  maxDepth(root)
  return max
};

// https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/description/?envType=study-plan-v2&envId=top-100-liked
// 给你二叉树的根结点 root ，请你将它展开为一个单链表：
// 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
// 展开后的单链表应该与二叉树 先序遍历 顺序相同。
// 对每个子树都需要进行展开处理
var flatten = function(root) {
  if (!root) return

  const left = root.left
  const right = root.right

  root.left = null
  root.right = left

  let p = root
  while (p && p.right) {
    p = p.right
  } 
  p.right = right

  flatten(root.left)
  flatten(root.right)
}

// https://leetcode.cn/problems/path-sum-iii/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
// 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
// 广度优先 + 深度优先 广度优先横向拿到每个子节点，再往下深度优先遍历子节点，算和

var pathSum = function(root, targetSum) {

  let count = 0
  
  function dfs(root, sum) {
    if (!root) return 0
    sum = sum + root.val
    if (sum === targetSum) count ++
    dfs(root.left, sum)
    dfs(root.right, sum)
  }

  const queue = [root]
  while (queue.length) {
    const len  = queue.length
    for (var i = 0; i < len; i ++) {
      const item = queue.shift()
      if (!item) continue
      dfs(item, 0)
      if (item.left) queue.push(item.left)
      if (item.right) queue.push(item.right)
    }
  }

  return count
}

// https://leetcode.cn/problems/permutations/submissions/557404043/?envType=study-plan-v2&envId=top-100-liked
// 全排列
var permute = function(nums) {  
  if (!nums || !nums.length) return
  let length = nums.length
  let used = []
  let path = []
  let ans = []
  function dfs(path, used) {
    if (path.length === nums.length) {
      ans.push([...path])
    }
    for (var i = 0; i < length; i ++) {
      const item = nums[i]
      if (used[item]) continue
      used[item] = true
      path.push(item)
      dfs(path, used)
      path.pop()
      used[item] = false
    }
  }

  dfs(path, used)

  return ans
};

// https://leetcode.cn/problems/subsets/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
// 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
// 示例 1：
// 输入：nums = [1,2,3]
// 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

var subsets = function(nums) {
  if (!nums || !nums.length) return [[]]
  const result = []
  function dfs(begin, path) {
    result.push([...path])
    for (var i = begin; i < nums.length; i ++) {
      path.push(nums[i])
      dfs(i + 1, path)
      path.pop()
    }
  }

  dfs(0, [])

  return result
};

// https://leetcode.cn/problems/combination-sum/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，
// 找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。
// candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 
// 对于给定的输入，保证和为 target 的不同组合数少于 150 个。
// 示例 1：
// 输入：candidates = [2,3,6,7], target = 7
// 输出：[[2,2,3],[7]]
// 解释：
// 2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
// 7 也是一个候选， 7 = 7 。
// 仅有这两种组合。
var combinationSum = function(candidates, target) {
  const result = []
  function dfs(left, path, begin) {
    if (left === 0) {
      result.push([...path])
      return
    }
    if (left < 0) return
    for (var i = begin; i < candidates.length; i ++) {
      const curItem = candidates[i]
      path.push(curItem)
      dfs(left - curItem, path, i)
      path.pop()
    }
  }

  dfs(target, [], 0)

  return result
};

console.log(combinationSum([2,3,6,7], 7))

// 二分
// https://leetcode.cn/problems/search-insert-position/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
// 请必须使用时间复杂度为 O(log n) 的算法。
// 示例 1:
// 输入: nums = [1,3,5,6], target = 5
// 输出: 2
var searchInsert = function(nums, target) { 
  let left = 0
  let right = nums.length - 1
  let mid = (left + right) >> 1

  while (left <= right) {
    mid = (left + right) >> 1
    const midNum = nums[mid]

    if (midNum > target) {
      right = mid - 1
    } else if (midNum < target) {
      left = mid + 1
    } else {
      return mid
    }
  }

  return left
};

console.log('searchInsert...', searchInsert([1,3,5,6], 4))

// https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
// 如果数组中不存在目标值 target，返回 [-1, -1]。
// 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题
// 示例 1：
// 输入：nums = [5,7,7,8,8,10], target = 8
// 输出：[3,4]
// var searchRange = function(nums, target) {
//   let left = 0
//   let right = nums.length - 1

//   while (left <= right) {
//     let mid = (left + right) >> 1
//     let midNum = nums[mid]

//     if (midNum > target) {
//       right = mid - 1
//     } else if (midNum < target) {
//       left = mid + 1
//     } else {
//       const indexs = [mid, mid]
//       const midVal = nums[mid]
//       let leftIndex = mid - 1
//       let rightIndex = mid + 1
//       let max = nums.length - 1
//       let min = 0
//       while (rightIndex <= max) {
//         if (midVal === nums[rightIndex]) {
//           indexs[1] = rightIndex
//         } else {
//           break
//         }

//         rightIndex ++
//       }
//       while (leftIndex >= min) {
//         if (midVal === nums[leftIndex]) {
//           indexs[0] = leftIndex
//         } else {
//           break
//         }

//         leftIndex --
//       }
//       return indexs
//     }
//   }

//   return [-1, -1]
// };

var searchRange = function(nums, target) {
  if (!nums || !nums.length) return [-1, -1]

  var binarySearch = function(searchRight) {
    var left = 0
    var right = nums.length - 1
    var ans
    while (left <= right) {
      var middle = (left + right) >> 1
      var midNum = nums[middle]
      if (midNum > target) {
        right = middle - 1
      } else if (midNum < target) {
        left = middle + 1
      } else {
        ans = middle
        if (!searchRight) {
          right = middle - 1
        } else {
          left = middle + 1
        }
      }
    } 
    return ans
  }

  var ans = []
  ans[0] = typeof binarySearch() !== 'undefined' ? binarySearch() : -1
  ans[1] = typeof binarySearch() !== 'undefined' ? binarySearch(true) : -1

  return ans
};

console.log('searchRange...', searchRange([8,8,8,8,8], 8))
console.log('searchRange...', searchRange([3,3,3], 3))

// https://leetcode.cn/problems/valid-parentheses/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
// 有效字符串需满足：
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 每个右括号都有一个对应的相同类型的左括号。
// 示例 1：
// 输入：s = "()"
// 输出：true
// 示例 2：
// 输入：s = "()[]{}"
// 输出：true
var isValid = function(s) {
  const map = {
    '(': ')',
    '[': ']',
    '{': '}'
  }
  const stack = []
  for (var i = 0; i < s.length; i ++) {
    if (s[i] === '(' || s[i] === '[' || s[i] === '{') {
      stack.push(s[i])
    } else {
      const item = stack.pop()
      if (s[i] != map[item]) {
        return false
      }
    }
  }

  return stack.length ? false : true
};

// https://leetcode.cn/problems/move-zeroes/description/?envType=study-plan-v2&envId=top-100-liked
// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
// 请注意 ，必须在不复制数组的情况下原地对数组进行操作。
// 示例 1:
// 输入: nums = [0,1,0,3,12]
// 输出: [1,3,12,0,0]
var moveZeroes = function(nums) {
  var low = 0, fast = 0

  while (fast < nums.length) {
    if (nums[fast] != 0) {
      nums[low] = nums[fast]
      low ++
    }

    fast ++ 
  }

  for (var i = low; i < nums.length; i ++) {
    nums[i] = 0
  }

  return nums
};

var hasCycle = function(head) {
  var low = head
  var fast = head

  while (fast && low) {
    low = low.next
    if (!fast.next) return false
    fast = fast.next.next
    if (fast === low) return true
  }

  return false
}