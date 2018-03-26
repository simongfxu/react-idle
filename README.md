# React User Idle

This project is inspired and forked from https://github.com/ReactTraining/react-idle .

![logo](./logo.png)

What?
-----

Notifies or break your app when the user is idle.

Why?
----

When the user is idle you can do things like preload some code-split bundles, download images that haven't been scrolled to, etc. Also useful to break the entire app to reduce serve burden.

Installation
------------

```bash
npm install react-user-idle
# or
yarn add react-user-idle
```

And then import it:

```js
// using es modules
import Idle from 'react-user-idle'

// common.js
const Idle = require('react-user-idle').default
```

Props
-----

### `render`

Whatever you'd like to render in response to changes in user activity.

### `children`

You should pick `render` or `children`, not both at the same time.
Once the component state idle comes to true, children will be rendered and will never gone.
This is useful when you wanna user to reload the page or to do some important things.

### `timeout`

How long before notifying that the user is idle in seconds.


### `throttle`

Seconds, using `lodash/throttle` to improve the preformance when user actions go fast

### `onChange`

Called whenever the user's activity state changes, a great time to change the owner component's state, or to kick off some imperative work like pre-fetching code-split bundles or images.

Demo Case 1: Break on idle
-----

```javascript
import Idle from 'react-user-idle'

render () {
  return (
    <Idle
      timeout={3600}
      throttle={5}
      onChange={() => console.log('report to server to record and do stat things')}
    >
      <Modal title="Connection Lost">
        Long time no action, you should refresh this page to reconnect.
      </Modal>
    </Idle>
  )
}
```

Demo Case 2: Preload resources
----

```javascript
import Idle from 'react-user-idle'

preload = (idle) => {
  if (idle) {
    console.log('preload images or other resoures')
  }
}

render () {
  return (
    <Idle
      timeout={3600}
      throttle={5}
      onChange={this.preload}
      render={idle => idle && <Indicator>Preloading some resources</Indicator>}
    />
  )
}
```
