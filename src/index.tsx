import React, {useState, useEffect} from 'react'
import {observable, observe} from '@nx-js/observer-util'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import routes from '@/bussiness/route.config'
import renderRoutes from '@/bussiness/utils/routes.render'
import PriorityApp from '@/concurrentExample/priorityApp'
import AsyncRender from '@/concurrentExample/asyncRender'
import UpdateTest from './updateExample'
// import TestSetStateComp from '@/concurrentExample/howSetStateWork'
import reducers from './reducers'
import CustomRender from './customRenderer'
import Dialog from './syntheticEvent'
import {produce} from './resource/clone/proxycopy'
// const Home = React.lazy(() => import('@/bussiness/page/home'))
// const PriorityApp = React.lazy(() => import('@/concurrentExample/priorityApp'))
// import PriorityApp from '@/concurrentExample/priorityApp'

const {unstable_ConcurrentMode: ConcurrentMode} = React

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: () => void): (() => void) => f,
  ),
)

function Example(props) {
  const {count} = props
  const handleClick = () => {
    setTimeout(() => {
      alert(count)
    }, 3000)
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Alert Count</button>
    </div>
  )
}

const Child = () => {
  let [val, setVal] = React.useState(0)

  React.useEffect(() => {
    console.log('hello')
  }, [val])

  const handleClick = () => {
    // setTimeout(() => {
    //   setVal(1)
    //   console.log('val...', val)
    // })

    setVal(val++)

    // setStr('sibling2')
    // setStr('sibling3')
  }

  return (
    <div className="button-sibling" onClick={handleClick}>
      {val}
    </div>
  )
}

const App = () => {
  let [count, setCount] = useState(0)

  // handleClick = () => {
  //   this.setState({
  //     count: 2
  //   })
  //   console.log(this.state)
  // }

  useEffect(() => {
    setCount(1)
    const a = {
      name: 'jack',
      age: 20,
      wife: {
        name: 'lynette',
        age: 18,
      },
    }

    const b = produce(a, proxy => {
      proxy.wife = {
        name: 'lynette2',
        age: 18,
      }
    })
    window.a = a
    window.b = b
  }, [])

  const counter = observable({
    num: 0,
    person: {
      name: 'jack',
    },
  })
  // const countLogger = observe(() => console.log('observe...', counter.person.name))

  // // this calls countLogger and logs 1
  counter.person.name = 'alice'

  useEffect(() => {
    window.addEventListener('scroll', () => {
      console.log('scroll is running')
      setCount(count++)
    })
  }, [])

  console.log('i am rendering')

  return (
    <>
      {/* <button onClick={this.handleClick}>{this.state.count}</button> */}
      <div style={{height: 1000}}>111</div>
      <Example count={count} />
    </>
    // <div className="root-app">
    //   <button onClick={this.handleClick}>{this.state.count}</button>
    //   {/* <Child /> */}
    //   {/* <React.Suspense fallback={null}>
    //     <PriorityApp />
    //   </React.Suspense> */}
    // </div>
  )
}

class Child2 extends React.Component<any, any> {
  state = {
    name: 'hello'
  }

  handleClick = () => {
    this.setState({
      name: 'hello world'
    })
  }

  componentDidMount() {
    console.log(2222)
  }

  render() {
    console.log('i am running')
    return <div onClick={this.handleClick}>111</div>
  }
}

class Parent extends React.Component<any, any> {
  componentDidMount() {
    // console.log(1111)
    // const data = window.context.name
    // console.log('name....', data)
  }

  handleClick = () => {
    this.setState({
      count: 1,
    })
    // this.setState({
    //   count: 2,
    // })
  }

  render() {
    console.log('i am running2')
    return (
      <>
        <div onClick={this.handleClick} className="test-cls">
          {/* {window.context.name} */}
          <div>this is page2</div>
        </div>
        <Child2 />
      </>
    )
  }
}

// createRoot(document.getElementById("root")).render(
//   <PriorityApp />
// );
// ReactDOM.unstable_createRoot(
//   document.getElementById('root')
// ).render(
//   <Parent />
// );

// export {
//   PriorityApp
// }
// CustomRender.render(<Parent />, document.getElementById('root'))
// if (window.effect) {
//   window.effect(() => {
//     console.log('window.context.name', window.context.name)
//     ReactDOM.render(<Parent />, document.getElementById('root2'))
//   })
// } else {
  ReactDOM.render(<Parent />, document.getElementById('root2'))
// }



