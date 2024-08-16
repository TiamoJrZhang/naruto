const {Worker, isMainThread} = require('worker_threads')
const {Mutex} = require('async-mutex')

if (isMainThread) {
  const numWorkers = 5
  let accountBalance = {
    count: 0,
  }
  const log = []
  const mutex = new Mutex()

  const workers = []

  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker(__filename, {workerData: {workerId: i}})
    workers.push(worker)
  }

  workers.forEach(worker => {
    worker.on('message', message => {
      mutex.acquire().then(release => {
        accountBalance.count = message.amount
        log.push(`Worker ${message.workerId} deposited $${message.amount}`)
        release()
      })
    })
  })

  Promise.all(workers.map(worker => new Promise(resolve => worker.on('exit', resolve)))).then(() => {
    console.log('All workers finished.')
    console.log('Final account balance:', accountBalance)
    console.log('Transaction log:', log)
  })
} else {
  // 在 worker.js 中实现存款操作
  const {parentPort, workerData} = require('worker_threads')

  const depositAmount = Math.floor(Math.random() * 100) + 1
  const {workerId} = workerData

  parentPort.postMessage({workerId, amount: depositAmount})
}
