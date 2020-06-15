import React, {Component} from 'react'
import {fakeNew} from '@/interview/index'
class Home extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      show: false,
    }
  }

  render() {
    const {show} = this.state
    return <>{show && <span>hello word</span>}</>
  }
}

export default Home
