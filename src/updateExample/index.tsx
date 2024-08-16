//研究react更新机制
import React, {useEffect, useState, Component} from 'react'

//对于hooks的setState更新在document.querySelector('.count').addEventListener('click', handleClick)触发的点击并不能立马获取到
//更新后的值，因为hook的state的计算需要在UpdateTest函数组件调用后通过useState重新计算得出，但是对于classcompoent更新后可以立马获取到更新之后的值
//因为this对象的存在，对象可以直接引用到更新后的值

// class UpdateTest extends Component {
//   state = {
//     count: 0
//   }

//   handleClick = () => {

//     this.setState({
//       count: 1
//     })

//     this.setState({
//       count: 2
//     })
//     //在classcomponent中同步
//     // console.log('count...', this.state.count)

//   }

//   componentDidMount() {
//     //测试同步setState
//     document.querySelector('.count').addEventListener('click', this.handleClick)
//   }

//   render() {
//     return <div className="count">{this.state.count}</div>;
//   }

// }

const UpdateTest: React.FC<any> = props => {
  const [count, setCount] = useState<number>(0)

  const handleClick = () => {
    // setCount(0)
    //测试批量更新
    //第一次setState的时候会通过scheduleSyncCallback将performSyncWorkOnRoot放入task事件队列（postmessage触发），同时也会进入syncQueue事件队列
    setCount(1)
    //第二次setState的时候会在ensureRootIsScheduled因为existingCallbackPriority == newCallbackPriority，导致更新中断，从而进入finally分支中的flushSyncCallbackQueue
    setCount(2)
    console.log('count...', count)
    //之前放入异步队列中的事件会由于flushSyncCallbackQueue中调用了scheduler_cancelCallback导致currentTask.callback == null而不执行
  }

  useEffect(() => {
    //测试同步setState
    document.querySelector('.count').addEventListener('click', handleClick)
  }, [])

  return <div className="count">{count}</div>
}

export default UpdateTest
