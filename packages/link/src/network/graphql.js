import { Client, defaultExchanges, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { pipe, subscribe } from 'wonka'
import { findIndex } from 'lodash'
import { updateStreamdecks, streamDecks } from '../streamdeck'
import { config } from '../utils/config'
import WebSocket from 'ws'
import log from '../utils/log'

let director
let subscriptionClient

const initGQLClient = (address, https) => {
  log('info', '/link/network/graphql', `Connecting to ${https ? 'https:' : 'http:'}//${address}/graphql`)
  subscriptionClient = new SubscriptionClient(`${https ? 'wss:' : 'ws:'}//${address}/graphql`, { reconnect: true, keepAlive: 5000 }, WebSocket)

  subscriptionClient.onDisconnected(() => {
    updateStreamdecks({ type: 'offline' })
    config.set('connection', { ...config.get('connection'), status: false })
  })

  subscriptionClient.onReconnecting(() => {
    updateStreamdecks({ type: 'connecting' })
  })

  subscriptionClient.onReconnected(() => {
    setTimeout(() => { updateStreamdecks({ type: 'connected' }) }, 1000)
    config.set('connection', { ...config.get('connection'), status: true })
  })

  subscriptionClient.onConnecting(() => {
    updateStreamdecks({ type: 'connecting' })
  })

  subscriptionClient.onConnected(() => {
    setTimeout(() => { updateStreamdecks({ type: 'connected' }) }, 1000)
    config.set('connection', { ...config.get('connection'), status: true })
  })

  subscriptionClient.onError(error => log('error', '/link/network/graphql', error.message))

  director = new Client({
    url: `${https ? 'https:' : 'http:'}//${address}/graphql`,
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
        log('error', 'link/network/graphql', result.error)
      }
      if (result.data && streamDecks.find(sd => sd.config.serial === result.data.controller.serial)) {
        log('info', 'link/network/graphql', result.data.controller.id)
        streamDecks[findIndex(streamDecks, (streamdeck) => streamdeck.config.serial === result.data.controller.serial)].config = result.data.controller
        updateStreamdecks({ type: 'connected', force: true })
      }
    })
  )
}

export { initGQLClient, director }
