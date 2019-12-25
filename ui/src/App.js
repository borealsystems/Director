// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { Provider, createClient } from 'urql'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './components/AlertTemplate.jsx'

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
  var [isLoggedIn] = useState(true)
  if (isLoggedIn === true) {
    return (
      <Provider value={client}>
        <AlertProvider template={AlertTemplate} position={'bottom left'} timeout={5000} transition="fade">
          <ControlPanel />
        </AlertProvider>
      </Provider>
    )
  }
  // return <LoginPage handleChange={handleLogin}/>
}

export default hot(module)(App)
