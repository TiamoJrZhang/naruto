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

var isSymmetric = function(root)  {
  return isMirror(root, root)
}

//循环
var isSymmetric2 = function(root)  {
  var stack = []
  stack[0] = root
  stack[1] = root
  while(stack.length) {
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
  var stack = [{
    deep: 1,
    node: root
  }]
  var curDeep = 0
  while(stack.length) {
    var item = stack.pop()
    var node = item.node
    if (!node.left && !node.right) {
      curDeep = Math.max(curDeep, item.deep)
    }
    if (node.left) {
      stack.push({
        deep: item.deep + 1,
        node: node.left
      })
    }
    if (node.right) {
      stack.push({
        deep: item.deep + 1,
        node: node.right
      })
    }
  }

  return curDeep
}