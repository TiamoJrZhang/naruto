// 给定一个二叉树，判断其是否是一个有效的二叉搜索树。 假设一个二叉搜索树具有如下特征： 节点的左子树只包含小于当前节点的数。
// 节点的右子树只包含大于当前节点的数。 所有左子树和右子树自身必须也是二叉搜索树。 示例 1: 输入:     2    / \
//   1   3
// 输出: true 示例 2: 输入:     5    / \
//   1   4      / \
//     3   6 输出: false
// 解释: 输入为: [5,1,4,null,null,3,6]。      根节点的值为 5 ，但是其右子节点值为 4 。
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

var isValidBST = function(root) {
  function helper(node, upper, lower) {
    if (node == null) return true
    if (node.val > upper || node.val < lower) return false
    return helper(node.left, node.val, lower) && helper(node.right, upper, node.val)
  }

  helper(root, Infinity, -Infinity)
}

var isValidBST1 = function(root) {
  let stack = []
  let inorder = -Infinity

  while (root != null || stack.length) {
    while (root) {
      stack.push(root)
      root = root.left
    }

    root = stack.pop()
    if (root.val <= inorder) return false
    inorder = root.val
    root = root.right
  }

  return true
}

var isValidBST2 = function(root) {
  let pre = -Infinity
  var result = true
  function helper(node) {
    if (node) {
      result = helper(node.left)
      if (node.val <= pre) return (result = false)
      pre = node.val
      result = helper(node.right)
    }
    return result
  }

  return helper(root)
}

//二叉树模板
function traverse(root) {
  if (root == null) return
  root += 1
  traverse(root.left)
  traverse(root.right)
}

function isSameTree(root1, root2) {
  if (root1 == null && root2 == null) return true
  if (root1 == null || root2 == null) return false
  if (root1.val != root2.val) return false
  return isSameTree(root1.left, root2.left) && isSameTree(root1.right, root2.right)
}

function isInBst(root, target) {
  if (root == null) return false
  if (root.val == target) return true

  return isInBst(root.left, target) || isInBst(root.right, target)
}

function isInBst2(root, target) {
  if (root.val == target) return true
  if (root.val < target) {
    return isInBst2(root.right, target)
  }
  if (root.val > target) {
    return isInBst2(root.left, target)
  }
}

function insertTreeNode(root, val) {
  if (root == null) return new TreeNode(val)
  if (val < root.left) {
    root.left = insertTreeNode(root.left, val)
  }
  if (val > root.right) {
    root.right = insertTreeNode(root.right, val)
  }
  return root
}

function getMin(node) {
  while (node.left) {
    node = node.left
  }
  return node
}

function deleteTreeNode(root, val) {
  if (root.val == val) {
    //左节点为空
    if (root.left == null) {
      return root.right
    }
    //右节点为空
    if (root.right == null) {
      return root.left
    }
    var minNode = getMin(root.right)
    root.val = minNode.val
    root.right = deleteTreeNode(root.right, minNode.val)
  }
  if (val < root.left) {
    root.left = deleteTreeNode(root.left, val)
  }
  if (val > root.right) {
    root.right = deleteTreeNode(root.right, val)
  }
  return root
}

//https://leetcode-cn.com/problems/validate-binary-search-tree/
function isValidBST(root) {
  return helper(root, null, null)
}

function helper(root, min, max) {
  if (!root) return true
  if (max != null && root.val >= max.val) return false
  if (min != null && root.val <= min.val) return false
  return helper(root.left, min, root) && helper(root.right, root, max)
}

//https://leetcode-cn.com/problems/merge-two-binary-trees/
var mergeTrees = function(t1, t2) {
  if (!t1 && !t2) return null
  if (!t1 && t2) return (t1 = t2)
  if (t1 && t2) t1.val += t2.val
  t1.left = mergeTrees(t1.left, t2 && t2.left)
  t1.right = mergeTrees(t1.right, t2 && t2.right)
  return t1
}

///https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/submissions/
var preorder = function(root) {
  var arr = []
  var dfs = function(root) {
    if (!root) return
    arr.push(root.val)
    for (var i = 0; i < root.children.length; i++) {
      dfs(root.children[i])
    }
  }
  dfs(root)
  return arr
}

var preorder = function(root) {
  if (!root) return []
  var stack = [root]
  var arr = []

  while (stack.length) {
    var item = stack.pop()
    if (!item) return
    arr.push(item.val)
    for (var i = item.children.length - 1; i >= 0; i--) {
      stack.push(item.children[i])
    }
  }

  return arr
}

//https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/
var maxDepth = function(root) {
  var max = 0
  if (!root) return 0
  if (root.children) {
    for (var i = 0; i < root.children.length; i++) {
      max = Math.max(max, maxDepth(root.children[i]))
    }
  }

  return max + 1
}

var maxDepth2 = function(root) {
  if (!root) return 0
  if (!root.children) return 1

  var stack = [
    {
      node: root,
      deep: 1,
    },
  ]
  var depth = 0
  while (stack.length) {
    var item = stack.pop()
    if (!item) return
    var node = item.node
    var prevDeep = item.deep
    depth = Math.max(prevDeep, depth)
    for (var i = node.children.length - 1; i >= 0; i--) {
      stack.push({
        node: node.children[i],
        deep: prevDeep + 1,
      })
    }
  }
  return depth
}

//https://leetcode-cn.com/problems/sum-of-left-leaves/submissions/
var sumOfLeftLeaves = function(root) {
  if (!root) return 0
  var stack = [root]
  var sum = 0
  while (stack.length) {
    var item = stack.pop()

    if (item.left) {
      if (item.left.left === null && item.left.right === null) {
        sum += item.left.val
      }
      stack.push(item.left)
    }
    if (item.right) {
      stack.push(item.right)
    }
  }
  return sum
}

var sumOfLeftLeaves2 = function(root) {
  var sum = 0
  var helper = function(node) {
    if (!node) return 0
    if (node.left && node.left.left == null && node.left.right == null) {
      sum += node.left.val
    }
    helper(node.left)
    helper(node.right)
  }
  helper(root)
  return sum
}

//https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
  var pVal = p.val
  var qVal = q.val

  if (pVal > root.val && qVal > root.val) {
    return lowestCommonAncestor(root.right, p, q)
  } else if (pVal < root.val && qVal < root.val) {
    return lowestCommonAncestor(root.left, p, q)
  } else {
    return root
  }
}

var lowestCommonAncestor = function(root, p, q) {
  var pVal = p.val
  var qVal = q.val

  while (root) {
    if (pVal > root.val && qVal > root.val) {
      root = root.right
    } else if (pVal < root.val && qVal < root.val) {
      root = root.left
    } else {
      return root
    }
  }
}

//https://leetcode-cn.com/problems/binary-tree-paths/
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
  var arr = []
  var helper = function(root, path) {
    if (!root) return []
    if (root.left == null && root.right == null) {
      path += root.val
      arr.push(path)
      return
    }
    path += root.val + '->'
    helper(root.left, path)
    helper(root.right, path)
  }
  helper(root, '')
  return arr
}

//https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function(root) {
  var minArr = []
  var helper = function(root, mindep) {
    if (!root) return
    mindep++
    if (!root.left && !root.right) {
      return minArr.push(mindep)
    }
    helper(root.left, mindep)
    helper(root.right, mindep)
  }
  root ? helper(root, 0) : (minArr = [0])
  return Math.min(...minArr)
}
//递归典型求最大最小值模板
var minDepth = function(root) {
  if (!root) return 0
  if (root.left == null && root.right == null) {
    return (min_depth = 1)
  }
  var min_depth = Number.MAX_VALUE

  if (root.left) {
    min_depth = Math.min(minDepth(root.left), min_depth)
  }
  if (root.right) {
    min_depth = Math.min(minDepth(root.right), min_depth)
  }
  return min_depth + 1
}

//https://leetcode-cn.com/problems/path-sum/submissions/
var hasPathSum = function(root, sum) {
  if (!root) return false
  var hasSum
  var helper = function(root, end) {
    if (!root) return false
    if (root.left == null && root.right == null) {
      end = end + root.val
      hasSum = sum == end ? true : false
    }
    end = end + root.val
    !hasSum && helper(root.left, end)
    !hasSum && helper(root.right, end)
  }
  helper(root, 0)
  return hasSum
}

var hasPathSum2 = function(root, sum) {
  if (!root) return false
  var stack = [root]
  var isSum = false
  var pre = 0
  while (stack.length) {
    var node = stack.pop()
    if (node.left === null && node.right === null) {
      pre += node.val
      if (pre == sum) isSum = true
    }
    pre += node.val
    if (node.left && !isSum) {
      stack.push(node.left)
    }

    if (node.right && !isSum) {
      stack.push(node.right)
    }
  }
  return isSum
}

//https://leetcode-cn.com/problems/binary-tree-inorder-traversal/
var inorderTraversal = function(root) {
  if (!root) return []
  var cur = root
  var stack = []
  var res = []
  while (stack.length || cur) {
    while (cur) {
      stack.push(cur)
      cur = cur.left
    }
    cur = stack.pop()
    res.push(cur.val)
    cur = cur.right
  }
  return res
}

//https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/
var kthSmallest = function(root, k) {
  if (!root) return
  var index = 0
  var stack = []
  var cur = root
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur)
      cur = cur.left
    }
    cur = stack.pop()
    if (index == k - 1) {
      return cur.val
    }
    cur = cur.right
    index++
  }
}

var kthSmallest2 = function(root, k) {
  var res = []
  var helper = function(root) {
    if (!root) return
    helper(root.left)
    res.push(root.val)
    helper(root.right)
  }
  helper(root)
  return res[k - 1]
}

//https://leetcode-cn.com/problems/binary-tree-right-side-view/
//bfs
const rightSideView = function(root) {
  if (!root) return []
  var queue = [root]
  var res = []
  while (queue.length) {
    var len = queue.length
    while (len) {
      var node = queue.shift()
      if (node.left) {
        queue.push(node.left)
      }
      if (node.right) {
        queue.push(node.right)
      }
      if (len == 1) {
        res.push(node.val)
      }
      len--
    }
  }
  return res
}

//dfs
const rightSideView2 = function(root) {
  var res = []
  var depth = 0
  var helper = function(root, depth) {
    if (!root) return
    if (depth == res.length) {
      res.push(root.val)
    }
    depth++
    helper(root.right, depth)
    helper(root.left, depth)
  }
  helper(root, depth)
  return res
}

//https://leetcode-cn.com/problems/balanced-binary-tree/
var isBalanced = function(root) {
  if (!root) return true
  return Math.abs(getHeight(root.left) - getHeight(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right)
}

var getHeight = function(root) {
  if (!root) return 0
  return Math.max(getHeight(root.left), getHeight(root.right)) + 1
}

var isBalanced2 = function(root) {
  var flag = true
  const helper = function(root) {
    if (!root) return 0

    var leftHeight = helper(root.left)
    var rightRight = helper(root.right)
    if (Math.abs(leftHeight - rightRight > 1)) {
      flag = false
      return
    }

    return Math.max(helper(root.left), helper(root.right)) + 1
  }
  helper(root)
  return flag
}

//bfs经典模板 https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/submissions/

var levelOrderBottom = function(root) {
  if (!root) return []
  var ans = []
  var level = 0
  var queue = [root]
  while (queue.length) {
    var len = queue.length
    ans[level] = []
    for (var i = 0; i < len; i++) {
      var item = queue.shift()
      ans[level].push(item.val)
      if (item.left) {
        queue.push(item.left)
      }
      if (item.right) {
        queue.push(item.right)
      }
    }
    level++
  }
  return ans
}
