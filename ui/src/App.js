// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import LoginPage from './views/LoginPage.jsx'
import ControlPanel from './views/ControlPanel.jsx'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { isLoggedIn: 1 }
  }

  render () {
    const isLoggedIn = this.state.isLoggedIn
    if (isLoggedIn === 1) {
      return <ControlPanel />
    }
    return <LoginPage />
  }
}

export default hot(module)(App)
