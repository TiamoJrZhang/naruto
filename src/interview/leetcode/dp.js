// 有一座高度是10级台阶的楼梯，从下往上走，每跨一步只能向上1级或者2级台阶。要求用程序来求出一共有多少种走法。
// F(1) = 1
// F(2) = 2
// F(10) = F(9) + F(8) n >= 3

//递归 O(2 ^ n)
function way(n) {
  if (n == 1) return 1
  if (n == 2) return 2
  if (n >= 3) {
    return way(n - 1) + way(n - 2)
  }
}

//备忘录 时间O(n) 空间O(n)
function way1(n) {
  if (n <= 0) return 0
  var map = new Map()
  if (n == 1) {
    return 1
  }
  if (n == 2) {
    return 2
  }
  if (map.has(n)) return map.get(n)
  var result = way(n - 1) + way(n - 2)
  map.set(n, result)
  return result
}

//dp
function way2(n) {
  if (n <= 0) return 0
  if (n == 1) return 1
  if (n == 2) return 2
  var a = 1
  var b = 2
  var temp = 0
  for (var i = 3; i <= n; i++) {
    temp = a + b
    a = b
    b = temp
  }
  return temp
}

//有一个国家发现了5座金矿，每座金矿的黄金储量不同，需要参与挖掘的工人数也不同。参与挖矿工人的总数是10人。
//每座金矿要么全挖，要么不挖，不能派出一半人挖取一半金矿。要求用程序求解出，要想得到尽可能多的黄金，应该选择挖取哪几座金矿？
//https://juejin.im/post/5a29d52cf265da43333e4da7

// n：金矿数 w：工人数量 p：金矿量 g[]：金矿用工量 p[]

//递归
function wg(n, w, p, g) {
  if (n == 1 && w > p[0]) return g[0]
  if (n == 1 && w < p[0]) return 0
  if (w < p[n - 1] && n > 1) return wg(n - 1, w, p, g)
  return Math.max(wg(n - 1, w, p, g), wg(n - 1, w - p[n - 1], p, g) + g[n - 1])
}

//dp
function getMostGold(n, w, p, g) {
  var preresults = new Array(p.length)
  var results = new Array(p.length)

  for (var i = 0; i < w; i++) {
    if (i < p[0]) {
      preresults[i] = 0
    } else {
      preresults[i] = g[0]
    }
  }

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < w; j++) {
      if (j < p[i]) {
        results[j] = preresults[j]
      } else {
        results[j] = Math.max(preresults[j], preresults[j - p[i]] + g[i])
      }
    }
  }

  return results
}

//给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
// 示例:
// 输入: [-2,1,-3,4,-1,2,1,-5,4],
// 输出: 6
// 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

//https://leetcode-cn.com/problems/maximum-subarray/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  var sum = 0
  var results = []
  if (nums.length == 0) return
  if (nums.length == 1) return nums[0]
  for (var i = 0; i < nums.length; i++) {
    if (nums[i] > sum) {
      results = nums[i]
    }
    sum = nums[i]
    for (var j = i + 1; j < nums.length; j++) {
      if (nums[j] + sum > sum) {
        sum = nums[j] + sum
        result = sum
      }
    }
  }
  return Math.max(...results)
}

//dp
var maxSubArray = function(nums) {
  let pre = 0
  let maxAns = nums[0]
  for (var i = 0; i < nums.length; i++) {
    pre = Math.max(pre + nums[i], nums[i])
    maxAns = Math.max(pre, maxAns)
  }
  return maxAns
}

// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。
// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。
// 问总共有多少条不同的路径？

// 示例 1:
// 输入: m = 3, n = 2
// 输出: 3
// 解释:
// 从左上角开始，总共有 3 条路径可以到达右下角。
// 1. 向右 -> 向右 -> 向下1
// 2. 向右 -> 向下 -> 向右
// 3. 向下 -> 向右 -> 向右

/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
  if (m < 1 || n < 1) return 0
  if (m == 1 || n == 1) return 1
  var dp = new Array(m)
  for (var i = 0; i < m; i++) {
    dp[i] = new Array(n)
    dp[i][0] = 1
  }
  for (var j = 0; j < n; j++) {
    dp[0][j] = 1
  }

  for (var i = 1; i < m; i++) {
    for (var j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    }
  }
  return dp[m - 1][n - 1]
}

// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。
// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。
// 现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？
// 网格中的障碍物和空位置分别用 1 和 0 来表示。
// 说明：m 和 n 的值均不超过 100。
// 示例 1:
// 输入:
// [
//   [0,0,0],
//   [0,1,0],
//   [0,0,0]
// ]
// 输出: 2
// 解释:
// 3x3 网格的正中间有一个障碍物。
// 从左上角到右下角一共有 2 条不同的路径：
// 1. 向右 -> 向右 -> 向下 -> 向下
// 2. 向下 -> 向下 -> 向右 -> 向右

/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
  var m = obstacleGrid.length
  var n = obstacleGrid[0].length
  var dp = new Array(m)

  for (var i = 0; i < m; i++) {
    dp[i] = new Array(n).fill(0)
  }

  dp[0][0] = obstacleGrid[0][0] == 1 ? 0 : 1
  if (dp[0][0] == 0) return dp[0][0]

  for (var i = 1; i < m; i++) {
    if (obstacleGrid[i][0] != 1) {
      dp[i][0] = dp[i - 1][0]
    }
  }
  for (var j = 1; j < n; j++) {
    if (obstacleGrid[0][j] != 1) {
      dp[0][j] = dp[0][j - 1]
    }
  }

  for (var i = 1; i < m; i++) {
    for (var j = 1; j < n; j++) {
      if (obstacleGrid[i][j] != 1) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
      }
    }
  }
  return dp[m - 1][n - 1]
}

//给定一个包含非负整数的 m x n 网格，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
// 说明：每次只能向下或者向右移动一步。
// 示例:
// 输入:
// [
//   [1,3,1],
//   [1,5,1],
//   [4,2,1]
// ]

// 输出: 7
// 解释: 因为路径 1→3→1→1→1 的总和最小。
/**
 * @param {number[][]} grid
 * @return {number}
 */

//递归
var minPathSum = function(grid) {
  const cost = function(grid, i, j) {
    if (i == grid.length || j == grid[0].length) return Number.MAX_SAFE_INTEGER
    if (i == grid.length - 1 && j == grid[0].length - 1) return grid[i][j]
    return grid[i][j] + Math.min(cost(grid, i + 1, j), cost(grid, i, j + 1))
  }

  return cost(grid, 0, 0)
}

//dp
var minPathSum1 = function(grid) {
  var m = grid.length
  var n = grid[0].length
  var dp = new Array(m)
  for (var i = 0; i < m; i++) {
    dp[i] = new Array(n).fill(0)
  }

  for (var i = m - 1; i >= 0; i--) {
    for (var j = n - 1; j >= 0; j--) {
      if (i == m - 1 && j == n - 1) {
        dp[i][j] = grid[i][j]
      } else if (i == m - 1 && j != n - 1) {
        dp[i][j] = grid[i][j] + dp[i][j + 1]
      } else if (i != m - 1 && j == n - 1) {
        dp[i][j] = grid[i][j] + dp[i + 1][j]
      } else {
        dp[i][j] = grid[i][j] + Math.min(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  return dp[0][0]
}
