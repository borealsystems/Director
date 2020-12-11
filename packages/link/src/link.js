import './tray'
import 'isomorphic-unfetch'
import { registerStreamdecks, updateStreamdecks } from './streamdeck'
import { initExpress } from './network/express'
import { initGQLClient } from './network/graphql'
import { config } from './utils/config'

config.init()
  .then(() => {
    initExpress()
  })
  .then(() => {
    registerStreamdecks()
  })
  .then(() => config.get('connection'))
  .then(connection => {
    console.log(connection)
    if (connection && connection.host) {
      updateStreamdecks({ type: 'offline' })
      initGQLClient(connection.host, connection.https)
    } else {
      updateStreamdecks({ type: 'unconfigured' })
    }
  })
