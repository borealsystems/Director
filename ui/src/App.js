// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import Login from './views/Login.jsx'
import ControlPanel from './views/ControlPanel.jsx'

const authState = 0

class App extends Component {
  render () {
    if (authState === 1) {
      return (
        <ControlPanel />
      )
    } else {
      return (
        <Login />
      )
    }
  }
}

export default hot(module)(App)
