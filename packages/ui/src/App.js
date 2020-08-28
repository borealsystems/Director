import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider, createClient } from 'urql'
import BorealDirector from './View/Index.jsx'
import './styles.scss'

import { BrowserRouter as Router } from 'react-router-dom'

const client = createClient({
  url: '/graphql',
  requestPolicy: 'network-only',
  maskTypename: true
})

const App = () => (
  <Provider value={client}>
    <Router>
      <BorealDirector />
    </Router>
  </Provider>
)

export default hot(App)
