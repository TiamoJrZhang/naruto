import React, {Component} from 'react'

type KeyboardHandler = React.KeyboardEventHandler<HTMLTextAreaElement>

export interface TextAreaProps {
  onPressEnter?: KeyboardHandler
  onKeyDown?: KeyboardHandler
  maxLength?: number
  disabled?: boolean
}

class Textarea extends Component<TextAreaProps> {
  constructor(props) {
    super(props)
    this.justTest = this.justTest.bind(this)
  }

  justTest = () => {
    console.log('this...', this)
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    this.justTest()
    const {onPressEnter, onKeyDown} = this.props
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e)
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  render() {
    const {maxLength, disabled} = this.props
    return (
      <div>
        <textarea onKeyDown={this.handleKeyDown} maxLength={maxLength} disabled={disabled} />
      </div>
    )
  }
}

export default Textarea
