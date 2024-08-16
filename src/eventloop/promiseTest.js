window.onload = function() {
  function innerHtml(num) {
    document.querySelector(`.btn${num}`).innerHTML = num
  }

  Promise.resolve()
    .then(() => {
      return Promise.resolve(4)
    })
    .then(res => {
      innerHtml(4)
      console.log(4)
    })

  Promise.resolve()
    .then(() => {
      innerHtml(1)
      console.log(1)
    })
    .then(() => {
      innerHtml(2)
      console.log(2)
    })
    .then(() => {
      innerHtml(3)
      console.log(3)
    })
    .then(() => {
      innerHtml(5)
      console.log(5)
    })
}
