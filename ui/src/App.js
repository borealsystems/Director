// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Client, setDefaultClient } from 'micro-graphql-react'

import LoginPage from './views/LoginPage.jsx'
import ControlPanel from './views/ControlPanel.jsx'

const client = new Client({
  endpoint: '/graphql',
  fetchOptions: { credentials: 'include' }
})

setDefaultClient(client)

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { isLoggedIn: 1 }
  }

  handleLogin () {
    this.setState({ isLoggedIn: 1 })
    console.log('Login')
  }

  render () {
    if (this.state.isLoggedIn === 1) {
      return <ControlPanel />
    }
    return <LoginPage handleChange={this.handleLogin}/>
  }
}

export default hot(module)(App)
