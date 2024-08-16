import React, {useEffect, useState, useRef, Component} from 'react'
//调试版本 React-dom version 0.0.0-experimental-27659559e

//react调试例子之高优先级任务打断低优先级任务
//这个例子的高低优先级其实是这样，正常渲染任务1先渲染，但是当节点数量太多时，任务还没完成，但是这时候任务2进来了，这时候任务2便会打断任务1，
//任务1会被pop出taskqueue（其实本质上任务1和任务2在内部调用的都是performConcurrentWorkOnRoot），任务2进入任务队列
//从优先队列中取出任务，这个时候为任务2并且执行，这个时候workinprogress被重新赋值rootfiber（在renderRootConcurrent中调用prepareFreshStack改变）
//这个时候优先级高的任务（或者说更新）会先执行，然后基于高优先级任务的更新执行下个任务
//componentWillUpdate之所以会执行多次的原因主要是因为在commitTmpl时还会在调用ensureRootIsScheduled方法，然后这时候lane还是不等于nolanes，导致再次开启了一次调度，
//即再次执行了performConcurrentWorkOnRoot，导致click引起的更新执行了两次

//测试hooks
// export default () => {
//   const buttonRef = useRef(null);
//   const [count, updateCount] = useState(0);

//   const onClick = () => {
//     updateCount((count) => count + 2);
//   };

//   useEffect(() => {
//     const button = buttonRef.current;
//     //任务1
//     setTimeout(() => updateCount(1), 1000);
//     //任务2
//     setTimeout(() => button.click(), 1040);
//   }, []);

//   return (
//     <div>
//       <button ref={buttonRef} onClick={onClick}>
//         增加2
//       </button>
//       <div>
//         {Array.from(new Array(5000)).map((v, index) => (
//           <span key={index}>{count}</span>
//         ))}
//       </div>
//     </div>
//   );
// };

//测试hclassComponent
class PriorityApp extends Component {
  // const buttonRef = useRef(null);
  // const [count, updateCount] = useState(0);

  buttonRef: any

  state = {
    count: 0,
  }

  onClick = () => {
    const {count} = this.state
    this.setState({
      count: count + 2,
    })
  }

  componentDidMount() {
    const {count} = this.state
    setTimeout(() => {
      this.setState({
        count: count + 1,
      })
    }, 1000)
    setTimeout(() => {
      this.buttonRef.click()
    }, 1040)
  }

  componentWillMount() {
    console.log('componentWillMount is running')
  }

  componentWillUpdate() {
    console.log('componentWillUpdate is running')
  }

  render() {
    return (
      <div>
        <button ref={item => (this.buttonRef = item)} className="test" onClick={this.onClick}>
          增加2
        </button>
        <div>
          {Array.from(new Array(5000)).map((v, index) => (
            <span key={index}>{this.state.count}</span>
          ))}
        </div>
      </div>
    )
  }
}

export default PriorityApp
