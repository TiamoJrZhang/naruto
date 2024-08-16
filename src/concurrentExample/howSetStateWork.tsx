import React from 'react'

class TestSetStateComp extends React.Component {
  state = {
    count: 1,
  }

  handleClick = () => {
    this.setState({
      count: 2,
    })
    this.setState({
      count: 3,
    })
  }

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.handleClick}>点击</button>
      </div>
    )
  }
}

export default TestSetStateComp
