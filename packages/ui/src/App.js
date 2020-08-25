import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider, createClient } from 'urql'
import BorealDirector from './View/Index.jsx'
import './styles.scss'

const client = createClient({
  url: '/graphql',
  requestPolicy: 'network-only',
  maskTypename: true
})

const App = () => (
  <Provider value={client}>
    <BorealDirector />
  </Provider>
)

export default hot(App)
