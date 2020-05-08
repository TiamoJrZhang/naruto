/** @format */

import React from 'react'
import {mount} from 'enzyme'
import Button from './button'

describe('Button', () => {
  // mountTest(Button)
  // mountTest(() => <Button size='small'/>)
  // mountTest(() => <Button size='large'/>)

  it('renders correctly', () => {
    expect(mount(<Button>Follow</Button>)).toMatchSnapshot()
  })
  it('should warning when pass a string as status props', () => {
    //mockImplementation可以将console.error模拟为() => {}防止在控制台输出console.error
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => void 0)
    mount(<Button size="small" status="ab" />)
    expect(warnSpy).toHaveBeenCalledWith('Warning: status can not be a string')
    warnSpy.mockRestore()
  })
  it('should support to change loading status', () => {
    const wrapper = mount(<Button>按钮</Button>)
    wrapper.setProps({loading: true})
    wrapper.update()
    expect(wrapper.find('.ant-btn-loading').length).toBe(1)
    wrapper.setProps({loading: false})
    wrapper.update()
    expect(wrapper.find('.ant-btn-loading').length).toBe(0)
    expect(() => wrapper.unmount()).not.toThrow()
  })
  it('should support link button', () => {
    const wrapper = mount(
      <Button target="_blank" href="http://ant.design">
        link button
      </Button>,
    )
    expect(wrapper.render()).toMatchSnapshot()
  })
})
