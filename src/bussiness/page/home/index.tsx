import React, {Component} from 'react'
// import MyPromise from '@/resource/promise'
// import {foo, run, thunkfiy} from '@/resource/promise/generator'

// const Home = () => {
//   useEffect(() => {
//     // run(foo)
//   }, [])

//   return <></>
// }
class Home extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      show: false,
    }
  }

  componentDidMount() {
    this.setState({
      show: true,
    })
  }

  render() {
    const {show} = this.state
    return <>{show && <span>hello word</span>}</>
  }
}

export default Home
