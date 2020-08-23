import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider, createClient } from 'urql'
import ControlPanel from './views/ControlPanel/ControlPanel.jsx'
import Login from './views/Login/Login.jsx'
import '../../../node_modules/carbon-components/scss/globals/scss/styles.scss'

const client = createClient({
  url: '/graphql',
  requestPolicy: 'network-only',
  maskTypename: true
})

const App = () => {
  const [isAuthenticated, setAuthentication] = useState(false)

  if (isAuthenticated) {
    return (
      <Provider value={client}>
        <ControlPanel />
      </Provider>
    )
  } else {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    } else {
      return (
        <Login auth={setAuthentication} />
      )
    }
  }
}

export default hot(App)
