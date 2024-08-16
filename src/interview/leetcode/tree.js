//参考https://leetcode-cn.com/problems/binary-tree-inorder-traversal/solution/zhuan-ti-jiang-jie-er-cha-shu-qian-zhong-hou-xu--2/
//二叉树前序遍历迭代法输出节点值
var orderTraversal1 = function(root) {
  if (!root) return
  var stack = []
  var result = []

  while (stack.length !== 0 || root) {
    while (root) {
      result.push(root.val)
      stack.push(root)
      root = root.left
    }

    var node = stack.pop()
    root = node.right
  }

  return result
}

//后序遍历，左右根 即根右左进行reverse
var orderTraversal2 = function(root) {
  if (!root) return
  var stack = []
  var result = []

  while (stack.length !== 0 || root) {
    while (root) {
      result.push(root.val)
      stack.push(root)
      root = root.right
    }

    var node = stack.pop()
    root = node.left
  }

  return result.reverse()
}

//中序遍历
var orderTraversal3 = function(root) {
  if (!root) return
  var stack = []
  var result = []

  while (stack.length !== 0 || root) {
    while (root) {
      stack.push(root)
      root = root.left
    }
    var node = stack.pop()
    result.push(node)
    root = node.right
  }

  return result
}

// 给定一个二叉树，检查它是否是镜像对称的。
// 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
// 1
// / \
// 2   2
// / \ / \
// 3  4 4  3
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */

//递归
var isMirror = function(p, q) {
  if (!p && !q) return true
  if (!p || !q) return false
  return p.val == q.val && isMirror(p.left, q.right) && isMirror(p.right, q.left)
}

var isSymmetric = function(root) {
  return isMirror(root, root)
}

//循环
var isSymmetric2 = function(root) {
  var stack = []
  stack[0] = root
  stack[1] = root
  while (stack.length) {
    var p = stack.pop()
    var q = stack.pop()
    if (!q && !p) continue
    if (!q || !p) return false
    if (p.val != q.val) return false
    stack.push(p.left)
    stack.push(q.right)
    stack.push(p.right)
    stack.push(q.left)
  }
  return true
}

// 给定一个二叉树，找出其最大深度。
// 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
// 说明: 叶子节点是指没有子节点的节点。
// 示例：
// 给定二叉树 [3,9,20,null,null,15,7]，

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回它的最大深度 3 。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if (!root) return 0
  return Math.max(maxDepth(root.left) + 1, maxDepth(root.right) + 1)
}

var maxDepth2 = function(root) {
  if (!root) return 0
  var stack = [
    {
      deep: 1,
      node: root,
    },
  ]
  var curDeep = 0
  while (stack.length) {
    var item = stack.pop()
    var node = item.node
    if (!node.left && !node.right) {
      curDeep = Math.max(curDeep, item.deep)
    }
    if (node.left) {
      stack.push({
        deep: item.deep + 1,
        node: node.left,
      })
    }
    if (node.right) {
      stack.push({
        deep: item.deep + 1,
        node: node.right,
      })
    }
  }

  return curDeep
}

//回溯算法
//https://leetcode-cn.com/problems/permutations/submissions/
var permute = function(nums) {
  if (!nums || !nums.length) return []
  var len = nums.length
  var ans = []
  function dfs(depth, path, used, nums) {
    if (depth === nums.length) {
      ans.push([...path])
      return
    }
    for (var i = 0; i < len; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])
      dfs(depth + 1, path, used, nums)
      path.pop()
      used[i] = false
    }
  }

  dfs(0, [], [], nums)

  return ans
}

// permute([1,2,3])

//全排列2
var permuteUnique = function(nums) {
  if (!nums || !nums.length) return []
  var ans = []
  function dfs(depth, path, used) {
    if (depth === nums.length) {
      ans.push([...path])
      return
    }
    for (var i = 0; i < nums.length; i++) {
      if (used[i]) continue
      //相同的起始数分支其实不需要再push进入path数组中
      if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue
      path.push(nums[i])
      used[i] = true
      dfs(depth + 1, path, used)
      path.pop()
      used[i] = false
    }
  }
  //先排序，方便去重
  nums = nums.sort((a, b) => a - b)
  dfs(0, [], [])
  return ans
}

var dp = function(count) {
  if (count === 2) return
  //对于循环在归的阶段会重新执行
  for (var i = 0; i < 2; i++) {
    console.log()
    console.log(`di..., count: ${count}, index: ${i}`)
    dp(count + 1)
    console.log()
    // console.log(`gui..., count: ${count}, index: ${i}`)
  }
}
// dp(0)

var combinationSum = function(candidates, target) {
  if (!candidates || !candidates.length) return []
  var ans = []
  candidates = candidates.sort((a, b) => a - b)
  function dfs(left, path, begin) {
    if (left < 0) return
    if (left == 0) {
      ans.push([...path])
      return
    }
    for (var i = begin; i < candidates.length; i++) {
      //剪枝
      if (target - candidates[i] < 0) break
      path.push(candidates[i])
      dfs(left - candidates[i], path, i)
      path.pop()
    }
  }
  dfs(target, [], 0)
  return ans
}

//https://leetcode-cn.com/problems/restore-ip-addresses/
var restoreIpAddresses = function(s) {
  if (!s || s.length === 0) return []
  if (s.length > 12 || s.length < 4) {
    return []
  }
  var ans = []
  function isCorrectNumber(begin, i, s) {
    var str = s.substring(begin, i + 1)
    if (str.length > 1 && str.charAt(0) === '0') return false
    var num = parseInt(str)
    return num >= 0 && num <= 255
  }
  function dfs(begin, ips, paths) {
    if (begin === s.length && ips === 0) {
      ans.push(paths.join('.'))
      return
    }
    //这里的begin和i的处理很巧妙，值得学习
    for (var i = begin; i < begin + 3; i++) {
      if (i > s.length) break
      //判断剩余的数字是否太多，比如我取了一个数2，这个时候剩余10个数，肯定不能组成正确的ip地址
      if (ips * 3 < s.length - i) continue
      if (isCorrectNumber(begin, i, s)) {
        paths.push(s.substring(begin, i + 1))
        dfs(i + 1, ips - 1, paths)
        paths.pop()
      }
    }
  }
  dfs(0, 4, [])
  return ans
}

var ans = restoreIpAddresses('25525511135')
console.log('ans...', ans)

var generateParenthesis = function(n) {
  var ans = []
  if (n == 0) return ans

  function dfs(curStr, left, right, ans) {
    if (left == 0 && right == 0) {
      ans.push(curStr)
      return
    }
    if (left > right) {
      return
    }
    if (left > 0) {
      dfs(curStr + '(', left - 1, right, ans)
    }
    if (right > 0) {
      dfs(curStr + ')', left, right - 1, ans)
    }
  }

  dfs('', n, n, ans)
  return ans
}

generateParenthesis(2)
