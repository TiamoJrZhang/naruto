import React from 'react'

export default class Dialog extends React.Component {
  state = {
    showBox: false,
  }
  componentDidMount() {
    document.addEventListener('click', this.handleClickBody, false)
  }
  handleClickBody = () => {
    console.log('i am running....')
    this.setState({
      showBox: false,
    })
  }
  handleClickButton = e => {
    e.nativeEvent.stopPropagation()
    this.setState({
      showBox: true,
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClickButton}>点击我显示弹窗</button>
        {this.state.showBox && <div onClick={e => e.nativeEvent.stopPropagation()}>我是弹窗</div>}
      </div>
    )
  }
}
