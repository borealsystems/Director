import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider, createClient } from 'urql'
import BorealDirector from './View/Index.jsx'
import globalContext from './globalContext'
import './styles.scss'

import { BrowserRouter as Router } from 'react-router-dom'

const client = createClient({
  url: '/graphql',
  requestPolicy: 'network-only',
  maskTypename: true
})

const App = () => {
  const [contextRealm, _setContextRealm] = useState(JSON.parse(localStorage.getItem('contextRealm')) ?? {})
  const setContextRealm = (event) => {
    localStorage.setItem('contextRealm', JSON.stringify(event))
    _setContextRealm(event)
  }
  return (
    <Provider value={client}>
      <Router>
        <globalContext.Provider value={{ contextRealm, setContextRealm }}>
          <BorealDirector />
        </globalContext.Provider>
      </Router>
    </Provider>
  )
}

export default hot(App)
