import './tray'
import 'isomorphic-unfetch'
import { updateStreamdecks } from './streamdeck'
import { initExpress } from './network/express'
import { initGQLClient } from './network/graphql'
import { config } from './utils/config'

config.init().then(config => {
  initExpress()
  updateStreamdecks({ type: 'refresh' })
  if (config.connection && config.connection.host) {
    updateStreamdecks({ type: 'offline' })
    initGQLClient(config.connection.host, config.connection.https)
  } else {
    updateStreamdecks({ type: 'unconfigured' })
  }
})
