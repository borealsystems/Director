// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { Provider, createClient } from 'urql'

// import LoginPage from './views/LoginPage.jsx'
import ControlPanel from './views/ControlPanel.jsx'

const client = createClient({
  url: 'http://localhost:3001/graphql'
})

// const handleLogin = () => {
//   isLoggedIn = 1
//   console.log('Login')
// }

const App = () => {
  // constructor (props) {
  //   super(props)
  //   this.state = { isLoggedIn: 1 }
  // }

  var isLoggedIn = useState(0)

  isLoggedIn = 1

  if (isLoggedIn === 1) {
    return (
      <Provider value={client}>
        <ControlPanel />
      </Provider>
    )
  }
  // return <LoginPage handleChange={handleLogin}/>
}

export default hot(module)(App)
