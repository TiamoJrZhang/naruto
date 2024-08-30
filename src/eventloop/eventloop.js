function eventloop() {
  console.log('normal')
  setTimeout(() => {
    console.log('setTimeout')
  });

  requestAnimationFrame(() => {
    console.log('requestAnimationFrame')
  })

  Promise.resolve().then(() => {
    console.log('promise')
  })
}

eventloop()