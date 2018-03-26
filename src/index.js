import {Component} from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'

const watchEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']

/**
 * two common situation for usage
 * 1) preload resources when user idle
 * 2) break the entire page when user has no action anymore
 *
 * in case 1, custom render is the preferred.
 * in case 2, usually modal children is preferred
 */
export default class Idle extends Component {
  static propTypes = {
    timeout: PropTypes.number,
    throttle: PropTypes.number,
    onChange: PropTypes.func,
    children: PropTypes.any
  }

  static defaultProps = {
    // seconds
    timeout: 60 * 15,
    // seconds, must less than timeout
    throttle: 5
  }

  state = {
    idle: false
  }

  // a tiemout timer to set idle state
  timer = null

  // a handler to reset the timer according to user action
  handler = null

  startTimer = () => {
    this.timer = setTimeout(() => {
      let breakOnIdle = this.props.children
      if (breakOnIdle) {
        this.removeEvents()
      }

      this.setState({idle: true})
    }, this.props.timeout * 1000)
  }

  resetTimer = () => {
    if (this.state.idle) {
      this.setState({idle: false})
    }

    clearTimeout(this.timer)
    this.startTimer()
  }

  attachEvents = () => {
    watchEvents.forEach(event => {
      window.addEventListener(event, this.handler, true)
    })
  }

  removeEvents = () => {
    clearTimeout(this.timer)
    watchEvents.forEach(event => {
      window.removeEventListener(event, this.handler, true)
    })
  }

  componentDidMount () {
    let throttleTime = this.props.throttle * 1000
    this.handler = throttleTime ? throttle(this.resetTimer, throttleTime) : this.resetTimer
    this.attachEvents()
    this.startTimer()
  }

  componentWillUnmount () {
    this.removeEvents()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.idle !== prevState.idle) {
      this.props.onChange && this.props.onChange(this.state.idle)
    }
  }

  render () {
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.idle)
    } else {
      return this.state.idle ? this.props.children : null
    }
  }
}
