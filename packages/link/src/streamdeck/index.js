import { director } from '../network/graphql'
import { writeTextToButton, writeImageToButton } from './graphics'
import { findIndex } from 'lodash'
import { updateBridgeMutationGQL, panelGQL, controllersQueryGQL } from './queries'
import { config } from '../utils/config'
import path from 'path'
import log from '../utils/log'
import writePanel from './utils/writePanel'
import handleButtonPress from './utils/handleButtonPress'
const open = require('open')

const { listStreamDecks, openStreamDeck } = require('elgato-stream-deck')

const streamDecks = []

let currentConnectionStatus

const getLayout = model => {
  switch (model) {
    case 'mini':
      return {
        id: 'elgato-streamdeck-mini',
        label: 'Elgato Streamdeck Mini',
        rows: 2,
        columns: 3
      }
  }
}

const updateStreamdecks = ({ type, force }) => {
  if ((currentConnectionStatus !== type) || force === true) {
    currentConnectionStatus = type
    log('info', 'link/streamdeck', `Update Type: ${type}`)
    switch (currentConnectionStatus) {
      case 'refresh' :
        try {
          listStreamDecks().map(device => {
            if (findIndex(streamDecks, (streamdeck) => streamdeck.path === device.path) === -1) {
              device.controller = openStreamDeck(device.path)
              device.config = {
                manufacturer: 'elgato',
                model: device.model,
                serial: device.serialNumber,
                type: {
                  id: 'bridged',
                  label: 'Bridged USB or Serial Controller'
                },
                layout: getLayout(device.model)
              }
              streamDecks.push(device)
            }
          })
        } catch (error) {
          log('error', 'link/streamdeck', error)
        }
        break

      case 'unconfigured':
        streamDecks.map(device => {
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeImageToButton(device, 0, path.join(__dirname, './graphics/circle_icon.png'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Configure Link', device: device, buttonIndex: 2 })
          device.controller.on('down', keyIndex => {
            if (keyIndex === 2) {
              open('http://localhost:3010')
              log('info', 'link/streamdeck', 'Opening Core Panel UI')
            } else {
              log('info', 'link/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
            }
          })
        })
        break

      case 'offline':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeImageToButton(device, 0, path.join(__dirname, './graphics/circle_icon.png'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Core Offline', device: device, buttonIndex: 2 })
        })
        break

      case 'shutdown':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeImageToButton(device, 0, path.join(__dirname, './graphics/circle_icon.png'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Link Closed', device: device, buttonIndex: 2 })
        })
        break

      case 'connecting':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeImageToButton(device, 0, path.join(__dirname, './graphics/circle_icon.png'))
          writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
          writeTextToButton({ text: 'Connecting', device: device, buttonIndex: 2 })
        })
        break

      case 'connected':
        director.query(controllersQueryGQL)
          .toPromise()
          .then(result => {
            if (result.error) {
              log('error', 'link/streamdeck', result.error)
            } else {
              log('info', 'link/streamdeck', `Core returned ${result.data.controllers.length} configured controller${result.data.controllers.length === 1 ? '' : 's'}`)
              streamDecks.map(device => {
                device.controller.clearAllKeys()
                device.controller.removeAllListeners('down')
                if (findIndex(result.data.controllers, controller => controller.serial === device.config.serial) === -1 || result.data.controllers[findIndex(result.data.controllers, controller => controller.serial === device.config.serial)].panel === undefined) {
                  writeImageToButton(device, 0, path.join(__dirname, './graphics/circle_icon.png'))
                  writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
                  writeTextToButton({ text: 'Configure Controller', device: device, buttonIndex: 2 })
                  device.controller.on('down', keyIndex => {
                    if (keyIndex === 2) {
                      open(`http://${config.get('connection').host}/config/controllers`)
                      log('info', 'link/streamdeck', 'Opening Core Panel UI')
                    } else {
                      log('info', 'link/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
                    }
                  })
                  director.query(updateBridgeMutationGQL, { bridge: { type: 'DirectorLink', version: '1.0.0', controllers: [...streamDecks.map(sd => { return sd.config })] } })
                    .toPromise()
                    .then(result => {
                      if (result.error) log('error', 'link/streamdeck', result.error)
                      log('info', 'link/streamdeck', result.data.updateBridge)
                    })
                } else {
                  const currentController = result.data.controllers[findIndex(result.data.controllers, controller => controller.serial === device.config.serial)]
                  if (currentController.panel) {
                    device.config.panel = currentController.panel
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
                  } else {
                    writeImageToButton(device, 0, path.join(__dirname, './graphics/circle_icon.png'))
                    writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
                    writeTextToButton({ text: 'Configure Controller', device: device, buttonIndex: 2 })
                    device.controller.on('down', keyIndex => {
                      if (keyIndex === 2) {
                        open(`http://${config.get('connection').host}/cores/${currentController.core}/realms/${currentController.realm}/config/controllers/${encodeURIComponent(currentController.id)}`)
                        log('info', 'link/streamdeck', 'Opening Core Panel UI')
                      } else {
                        log('info', 'link/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
                      }
                    })
                  }
                }
              })
            }
          })
        break
    }
  }
}

export { updateStreamdecks, streamDecks }
