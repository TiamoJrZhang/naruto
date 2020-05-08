/** @format */

import React from 'react'
import {mount} from 'enzyme'
import TextArea from './textarea'

describe('TextArea', () => {
  it('TextArea should support onKeyDown and onPressEnter', () => {
    const fakeHandleKeyDown = jest.fn()
    const fakeHandlePressEnter = jest.fn()

    const wrapper = mount(<TextArea onKeyDown={fakeHandleKeyDown} onPressEnter={fakeHandlePressEnter} />)
    wrapper.find('textarea').simulate('keydown', {keyCode: 65})
    expect(fakeHandleKeyDown).toHaveBeenCalledTimes(1)
    expect(fakeHandlePressEnter).toHaveBeenCalledTimes(0)
    wrapper.find('textarea').simulate('keydown', {keyCode: 13})
    expect(fakeHandleKeyDown).toHaveBeenCalledTimes(2)
    expect(fakeHandlePressEnter).toHaveBeenCalledTimes(1)
  })

  it('TextArea should support maxLength', () => {
    const wrapper = mount(<TextArea maxLength={10} />)
    expect(wrapper.render()).toMatchSnapshot()
  })

  it('TextArea should support disable', () => {
    const wrapper = mount(<TextArea disabled />)
    expect(wrapper.render()).toMatchSnapshot()
  })
})
