// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { Provider, createClient } from 'urql'
import ControlPanel from './views/ControlPanel/ControlPanel.jsx'
import '../../../node_modules/carbon-components/scss/globals/scss/styles.scss'

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
