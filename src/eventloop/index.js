//强制同步布局FSL
function init() {
  const array = document.querySelectorAll('.box')
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    //引起强制同步布局，当前js循环还在运行，还未到布局那一步，但这里获取了table的宽度，导致浏览器需要提前进行布局来获取宽度
    const offsetWidth = document.querySelector('.table').offsetWidth
    element.style.width = offsetWidth + 'px'
  }
}

//FLIP策略
function addEventListener() {
  const tg2 = document.querySelector('.table')
  tg2.addEventListener('click', function() {
    var rt = tg2.getBoundingClientRect()
    tg2.style.left = '400px'
    var rt2 = tg2.getBoundingClientRect()
    var invert = rt.left - rt2.left
    console.log(invert)
    tg2.style.transform = 'translateX(' + invert + 'px)'
    requestAnimationFrame(function() {
      tg2.className = tg2.className + ' trans2'
      tg2.style.transform = ''
    })
  })
}

//测试事件循环
function initEventLoop() {
  const ayncFunc = async () => {
    await awaitFunc()
    console.log('ayncFunc...')
  }

  awaitFunc = () => {
    Promise.resolve().then(function() {
      console.log('awaitFunc..')
    })
  }

  ayncFunc()

  console.log(2)
  Promise.resolve().then(function() {
    console.log(3)
  })
  setTimeout(function() {
    console.log('setTimeout1')
    Promise.resolve().then(function() {
      console.log(4)
    })
  })
  setTimeout(function() {
    console.log('setTimeout2')
  })
}

//探究事件循环与渲染的关系
//事件循环队列为空时浏览器判断是否该渲染
function initBtnClick() {
  const btn = document.querySelector('.btn')
  const text = document.querySelector('.text')
  btn.addEventListener('click', function() {
    //一轮事件循环，在perfermance里面显示为一个灰色的task
    setTimeout(function() {
      Promise.resolve().then(function() {
        text.innerHTML = '我被点击了'
      })
    })
    //又一轮事件循环
    setTimeout(function() {
      text.innerHTML = '我又被点击了'
    }, 50)
  })
}

function frameStartAndEnd() {
  var frameTime = 1000 / 60
  var {port1, port2} = new MessageChannel()
  requestAnimationFrame(function() {
    var curTime = performance.now()
    var nextFrameTime = curTime + frameTime
    port1.postMessage(undefined)
    console.log('i am runing at rendering', curTime)
  })
  port2.onmessage = function() {
    var curTime2 = performance.now()
    console.log('i am runing after render', curTime2)
  }
}

// 定义一个立即执行函数,传入生成的依赖关系图;
;(function(graph) {
  // 重写require函数
  function require(moduleId) {
    // 找到对应moduleId的依赖对象,调用require函数,eval执行,拿到exports对象
    function localRequire(relativePath) {
      return require(graph[moduleId].dependecies[relativePath]) // {__esModule: true, say: ƒ say(name)}
    } // 定义exports对象
    var exports = {}
    ;(function(require, exports, code) {
      // commonjs语法使用module.exports暴露实现,我们传入的exports对象会捕获依赖对象(hello.js)暴露的实现(exports.say = say)并写入
      eval(code)
    })(localRequire, exports, graph[moduleId].code) // 暴露exports对象,即暴露依赖对象对应的实现
    return exports
  } // 从入口文件开始执行
  require('./src/index.js')
})({
  './src/index.js': {
    dependecies: {'./hello.js': './src/hello.js'},
    code: '"use strict";\n\nvar _hello = require("./hello.js");\n\ndocument.write((0, _hello.say)("webpack"));',
  },
  './src/hello.js': {
    dependecies: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}',
  },
})

window.onload = function() {
  // init()
  // addEventListener()
  // initEventLoop()
  // initBtnClick()
  frameStartAndEnd()
}
