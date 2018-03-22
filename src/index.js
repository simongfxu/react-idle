import {Component} from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'

const watchEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']

export default class Idle extends Component {
  static propTypes = {
    timeout: PropTypes.number,
    throttle: PropTypes.number,
    breakOnIdle: PropTypes.bool,
    onChange: PropTypes.func,
    // render according to idle state
    render: PropTypes.func,
    children: PropTypes.any
  }

  static defaultProps = {
    // seconds
    timeout: 60 * 15,
    // seconds, must less than timeout
    throttle: 5,
    /**
     * stop the detect action when no user action
     * lead user to refresh page or do other things
     * usually to reduce server burder
     */
    breakOnIdle: true,
    // to do some stuff on idle, preload images / close websocket or polling
    onChange: idle => console.log(`Idle: ${idle}`)
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
      if (this.props.breakOnIdle) {
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
    this.handler = this.props.throttle ? throttle(this.resetTimer, this.props.throttle * 1000) : this.resetTimer
    this.attachEvents()
    this.startTimer()
  }

  componentWillUnmount () {
    this.removeEvents()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.idle !== prevState.idle) {
      this.props.onChange(this.state.idle)
    }
  }

  render () {
    if (this.props.render) {
      return this.props.render(this.state.idle)
    }

    return this.state.idle ? this.props.children : null
  }
}
