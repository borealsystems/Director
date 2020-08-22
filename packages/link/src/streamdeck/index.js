import { director } from '../network/graphql'
import { directorCore } from '../network/mdns'
import { writeTextToButton, writeImageToButton } from './graphics'
import { findIndex } from 'lodash'
import path from 'path'
import log from '../utils/log'
import writePanel from './utils/writePanel'
import handleButtonPress from './utils/handleButtonPress'
const open = require('open')

const { listStreamDecks, openStreamDeck } = require('elgato-stream-deck')

const streamDecks = []

const updateBridgeMutationGQL = `
mutation updateBridge($bridge: bridgeUpdateInputType) {
  updateBridge(bridge: $bridge)
}`

const panelGQL = `
  query panel($id: String) {
    panel(id: $id) {
      id
      label
      buttons {
        row
        column
        stack {
          id
          label
          panelLabel
          description
        }
      }
    }
  }`

const controllersQueryGQL = `
query controllers {
  controllers {
    manufacturer
    model
    serial
    status
    panel {
      label
      id
    }
    id
    label
  }
}`

let currentConnectionStatus

const updateStreamdecks = ({ type, force }) => {
  if ((currentConnectionStatus !== type) || force === true) {
    currentConnectionStatus = type
    log('info', 'link/streamdeck', `Update Type: ${type}`)
    switch (currentConnectionStatus) {
      case 'refresh' :
        listStreamDecks().map(device => {
          if (findIndex(streamDecks, (streamdeck) => streamdeck.path === device.path) === -1) {
            device.controller = openStreamDeck(device.path)
            device.config = { manufacturer: 'elgato', model: device.model, serial: device.serialNumber }
            streamDecks.push(device)
          }
        })
        break

      case 'offline':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          writeImageToButton(device, 0, path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Core Offline', device: device, buttonIndex: 2 })
        })
        break

      case 'shutdown':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          writeImageToButton(device, 0, path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Link Closed', device: device, buttonIndex: 2 })
        })
        break

      case 'connecting':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          writeImageToButton(device, 0, path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Connecting', device: device, buttonIndex: 2 })
        })
        break

      case 'connected':
        director.query(controllersQueryGQL)
          .toPromise()
          .then(result => {
            log('info', 'link/streamdeck', `Core returned ${result.data.controllers.length} configured controller${result.data.controllers.length === 1 ? '' : 's'}`)
            streamDecks.map(device => {
              device.controller.clearAllKeys()
              if (findIndex(result.data.controllers, controller => controller.serial === device.config.serial) === -1) {
                writeImageToButton(device, 0, path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
                writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
                writeTextToButton({ text: 'Configure Controller', device: device, buttonIndex: 2 })
                device.controller.on('down', keyIndex => {
                  if (keyIndex === 2) {
                    open(`http://${directorCore.address}:${directorCore.service.port}/config/controllers`)
                    log('info', 'link/streamdeck', 'Opening Core Panel UI')
                  } else {
                    log('info', 'link/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
                  }
                })
                director.query(updateBridgeMutationGQL, { bridge: { type: 'DirectorLink', version: '1.0.0', controllers: [...streamDecks.map(sd => { return sd.config })] } })
                  .toPromise()
                  .then(result => {
                    log('info', 'link/streamdeck', result.data.updateBridge)
                  })
              } else {
                device.config.panel = result.data.controllers[findIndex(result.data.controllers, controller => controller.serial === device.config.serial)].panel
                director.query(panelGQL, { id: device.config.panel.id })
                  .toPromise()
                  .then(result => {
                    device.controller.removeAllListeners('down')
                    device.controller.removeAllListeners('up')
                    device.controller.on('down', keyIndex => {
                      handleButtonPress(device, keyIndex)
                    })
                    const buttons = []
                    result.data.panel.buttons.map(row => { buttons.push(Object.keys(row).map((key) => { return row[key] })) })
                    device.config.panel = { ...result.data.panel, buttons: buttons }
                    writePanel({ panel: device.config.panel, device: device })
                  })
              }
            })
          })
        break
    }
  }
}

export { updateStreamdecks, streamDecks }
