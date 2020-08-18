import { Client, defaultExchanges, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { pipe, subscribe } from 'wonka'
import { findIndex } from 'lodash'
import { updateStreamdecks, streamDecks } from '../streamdeck'
import WebSocket from 'ws'
import log from '../utils/log'

let director
let subscriptionClient

const initGQLClient = (address, port) => {
  subscriptionClient = new SubscriptionClient(`ws://${address}:${port}/graphql`, { reconnect: true }, WebSocket)

  subscriptionClient.onDisconnected(() => { updateStreamdecks({ type: 'offline' }) })
  subscriptionClient.onReconnecting(() => { updateStreamdecks({ type: 'connecting' }) })
  subscriptionClient.onReconnected(() => { setTimeout(() => { updateStreamdecks({ type: 'connected' }) }, 1000) })
  subscriptionClient.onConnecting(() => { updateStreamdecks({ type: 'connecting' }) })
  subscriptionClient.onConnected(() => { setTimeout(() => { updateStreamdecks({ type: 'connected' }) }, 1000) })

  director = new Client({
    url: `http://${address}:${port}/graphql`,
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

  const controllerUpdateGQL = `
    subscription controller {
      controller {
        label
        manufacturer
        model
        serial
        status
        panel {
          id
          label
        }
        id
      }
    }`

  pipe(
    director.subscription(controllerUpdateGQL),
    subscribe(result => {
      if (result.error) {
        log('error', 'link/src/network/graphql', result.error)
      }
      if (result.data) {
        log('info', 'link/src/network/graphql', result.data.controller.id)
        streamDecks[findIndex(streamDecks, (streamdeck) => streamdeck.config.serial === result.data.controller.serial)].config = result.data.controller
        updateStreamdecks({ type: 'connected', force: true })
      }
    })
  )
}

export { initGQLClient, director }
