// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { Provider, createClient } from 'urql'
import ControlPanel from './views/ControlPanel/ControlPanel.jsx'
import './styles/carbon-components.css'

const client = createClient({
  url: '/gql',
  requestPolicy: 'network-only'
})

const App = () => {
  return (
    <Provider value={client}>
      <ControlPanel />
    </Provider>
  )
}

export default hot(module)(App)
