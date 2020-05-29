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

window.onload = function() {
  // init()
  // addEventListener()
  // initEventLoop()
  initBtnClick()
}
