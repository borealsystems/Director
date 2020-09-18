import 'isomorphic-unfetch'
import './tray'
import { updateStreamdecks } from './streamdeck'
import { initGQLClient } from './network/graphql'

updateStreamdecks({ type: 'refresh' })
updateStreamdecks({ type: 'offline' })
initGQLClient('127.0.0.1', 3001)
