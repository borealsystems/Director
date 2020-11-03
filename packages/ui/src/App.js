import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider, Client, defaultExchanges, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { BrowserRouter as Router } from 'react-router-dom'
import BorealDirector from './View/Index.jsx'
import globalContext from './globalContext'
import './theme.scss'

const subscriptionClient = new SubscriptionClient(`ws://${window.location.hostname}:${window.location.port}/graphql`, { reconnect: true })

const client = new Client({
  url: '/graphql',
  requestPolicy: 'network-only',
  maskTypename: true,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription (operation) {
        return subscriptionClient.request(operation)
      }
    })
  ]
})

const App = () => {
  const [contextRealm, _setContextRealm] = useState(JSON.parse(localStorage.getItem('contextRealm')) ?? {})
  const setContextRealm = (event) => {
    localStorage.setItem('contextRealm', JSON.stringify(event))
    _setContextRealm(event)
  }

  const darkClass = 'dx--dark'
  const lightClass = 'dx--light'

  const [theme, _setTheme] = useState(localStorage.getItem('uiTheme') ?? darkClass)

  const toggleTheme = () => {
    switch (theme) {
      case darkClass :
        document.body.classList.remove(darkClass)
        document.body.classList.add(lightClass)
        localStorage.setItem('uiTheme', lightClass)
        _setTheme(lightClass)
        break
      case lightClass :
        document.body.classList.remove(lightClass)
        document.body.classList.add(darkClass)
        localStorage.setItem('uiTheme', darkClass)
        _setTheme(darkClass)
        break
    }
  }

  return (
    <Provider value={client}>
      <Router>
        <globalContext.Provider value={{ contextRealm, setContextRealm, theme, toggleTheme }}>
          <BorealDirector />
        </globalContext.Provider>
      </Router>
    </Provider>
  )
}

export default hot(App)
