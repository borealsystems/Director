import './tray'
import 'isomorphic-unfetch'
import { updateStreamdecks } from './streamdeck'
import { initExpress } from './network/express'
import { initGQLClient } from './network/graphql'
import { config } from './utils/config'

config.init().then(config => {
  initExpress()
  updateStreamdecks({ type: 'refresh' })
  if (config.connection && config.connection.port && config.connection.port) {
    updateStreamdecks({ type: 'offline' })
    initGQLClient(config.connection.host, config.connection.port)
  } else {
    updateStreamdecks({ type: 'unconfigured' })
  }
})
