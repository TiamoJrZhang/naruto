import React, {Component, useState, useCallback} from 'react'

// class Child extends Component {
//   // const [count, setCount] = useState(0)
//   state = {
//     count: 0
//   }

//   handleClick = () => {
//     this.setState({
//       count: 0
//     })
//   }

//   render() {
//     console.log('child is running')
//     return (
//       <button onClick={this.handleClick}>{this.state.count} click me</button>
//     )
//   }
// }

const Child = ({callback}: {callback: () => void}) => {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    callback()
  }
  console.log('child is running')
  return <button onClick={handleClick}>{count} click me</button>
}

class Home extends Component {
  state = {
    count: 1,
  }

  // const callback = useCallback(() => {
  //   console.log(111)
  // }, [])

  handleClick = () => {
    debugger
    const {count} = this.state
    this.setState({
      count: count + 1,
    })
    this.setState({
      count: count + 1,
    })
    this.setState({
      count: count + 1,
    })
    console.log('count...', count)
  }

  render() {
    return (
      <>
        <button onClick={this.handleClick}>test</button>
        {/* <Child callback={callback} /> */}
      </>
    )
  }
}

// class Home extends Component<any, any> {
//   constructor(props: any) {
//     super(props)
//     this.state = {
//       count: 0
//     }
//   }

//   render() {
//     console.log('i am running')
//     const {count} = this.state
//     return (
//       <>
//         <Child />
//         <span>{count}</span>
//         {/* <button onClick={() => this.setState((pre: any) => {
//           return { ...pre, count: 1 }
//         })}
//         >
//           click
//         </button> */}
//       </>
//     )
//   }
// }

export default Home
