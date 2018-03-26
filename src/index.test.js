import {mount} from 'enzyme'
import React from 'react'
import Idle from './index'

describe('Idle', function () {
  it('should render empty when no children or render props set', () => {
    const wrapper = mount(<Idle />)
    expect(wrapper.children().length).toBe(0)
  })

  it('should render empty when idle not trigger', () => {
    const wrapper = mount(<Idle>Long time no action</Idle>)
    expect(wrapper.children().length).toBe(0)
  })

  it('should render children elements when idle', () => {
    let timeout = 10
    const wrapper = mount(<Idle timeout={timeout} throttle={1}><div>Long time no action</div></Idle>)
    expect(wrapper.children().length).toBe(0)
    jest.advanceTimersByTime(timeout * 1000)
    wrapper.update()
    expect(wrapper.children().length).toBe(1)
  })

  it('should render by custom function', () => {
    let timeout = 10
    const wrapper = mount(<Idle timeout={timeout} throttle={1} render={idle => <div>Current idle status: {idle}</div>} />)
    expect(wrapper.children().length).toBe(1)
    let text = wrapper.find('div').at(0).text()
    expect(text.indexOf('false') > -1)

    jest.advanceTimersByTime(timeout * 1000)
    wrapper.update()

    expect(wrapper.children().length).toBe(1)
    text = wrapper.find('div').at(0).text()
    expect(text.indexOf('true') > -1)
  })

  it('should delay the timeout when user does action', () => {
    let timeout = 10
    const wrapper = mount(<Idle timeout={timeout} throttle={1} render={idle => <div>Current idle status: {idle.toString()}</div>} />)

    jest.advanceTimersByTime(timeout * 1000 * 0.5)
    let div = wrapper.find('div').at(0)
    expect(div.text().indexOf('false') > -1).toBe(true)
    let event = new Event('mousedown')
    window.dispatchEvent(event)

    jest.advanceTimersByTime(timeout * 1000 * 0.5)
    wrapper.update()
    expect(wrapper.find('div').at(0).text().indexOf('false') > -1).toBe(true)

    jest.advanceTimersByTime(timeout * 1000 * 0.5)
    wrapper.update()
    expect(wrapper.find('div').at(0).text().indexOf('true') > -1).toBe(true)
  })
})
