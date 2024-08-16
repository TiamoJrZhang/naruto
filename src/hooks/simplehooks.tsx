const hooks = new Map()
let count = 0
let isMount = true

const fiber: {
  stateNode: () => HTMLElement
} = {
  stateNode: null,
}

const React = {}

function Render() {
  fiber.stateNode()
}

// function dispatchAction(queue, action) {
//   const update = {
//     action,
//     next: null
//   }

//   if (queue.pending === null) {
//     update.next = update;
//   } else {
//     update.next = queue.pending.next;
//     queue.pending.next = update;
//   }
//   queue.pending = update;

//   // 模拟React开始调度更新
//   schedule();
// }

function useState(initState: any) {
  let endState

  if (isMount == true) {
    //mount阶段生成hooks
    var hook = {
      memorizedState: initState,
    }
    hooks.set(count, hook)
    count++
  } else {
    //update阶段更新hooks
  }

  return [endState, dispatchAction.bind(null, hooks)]
}
