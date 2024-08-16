const { length: cpusLength } = require('os').cpus();

class WorkerPool {
  constructor() {
    this.queue = []
    this.poolMap = new Map()
  }

  create() {

  }


}