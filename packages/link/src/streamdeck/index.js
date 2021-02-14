import { director } from '../network/graphql'
import { writeTextToButton } from './graphics'
import { findIndex } from 'lodash'
import { updateBridgeMutationGQL, panelGQL, controllersQueryGQL } from './queries'
import { config } from '../utils/config'
import log from '../utils/log'
import writePanel from './utils/writePanel'
import handleButtonPress from './utils/handleButtonPress'
const open = require('open')

const { listStreamDecks, openStreamDeck } = require('elgato-stream-deck')

let streamDecks = []

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
    case 'xl':
      return {
        id: 'elgato-streamdeck-xl',
        label: 'Elgato Streamdeck XL',
        rows: 4,
        columns: 8
      }
    case 'original':
      return {
        id: 'elgato-streamdeck-original',
        label: 'Elgato Streamdeck',
        rows: 3,
        columns: 5
      }
  }
}

const registerStreamdecks = () => new Promise((resolve, reject) => {
  resolve()
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
        device.controller.clearAllKeys()
        device.controller.removeAllListeners('down')
        device.controller.setBrightness(100)
        device.controller.on('error', err => {
          log('error', 'link/streamdeck', err)
          // eslint-disable-next-line eqeqeq
          if (err == 'Error: could not read from HID device') {
            log('warn', 'link/streamdeck', `Removing Disconnected Controller ${device.config.serial}`)
            streamDecks = streamDecks.filter(streamdeck => streamdeck.config.serial !== device.config.serial)
          }
        })
        streamDecks.push(device)
      } else {
        log('warn', 'link/streamdeck', `Device already registered ${device.serial}`)
      }
    })
  } catch (error) {
    log('error', 'link/streamdeck', error)
  }
})

const updateStreamdecks = ({ type, force, serial, panel }) => {
  if ((currentConnectionStatus !== type) || force === true) {
    currentConnectionStatus = type
    log('debug', 'link/streamdeck', `Update Type: ${type}`)
    switch (currentConnectionStatus) {
      case 'refresh':
        return true

      case 'unconfigured':
        streamDecks.map(device => {
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
          writeTextToButton({ text: 'Configure\nLink', device: device, buttonIndex: 1 })
          device.controller.on('down', keyIndex => {
            if (keyIndex === 1) {
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
          writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
          writeTextToButton({ text: 'Core\nOffline', device: device, buttonIndex: 1 })
        })
        break

      case 'shutdown':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
          writeTextToButton({ text: 'Link\nClosed', device: device, buttonIndex: 1 })
        })
        break

      case 'connecting':
        streamDecks.map(device => {
          device.configured = false
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
          writeTextToButton({ text: 'Connecting', device: device, buttonIndex: 1 })
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
                  writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
                  writeTextToButton({ text: 'Configure\nController', device: device, buttonIndex: 1 })
                  device.controller.on('down', keyIndex => {
                    if (keyIndex === 1) {
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
                    writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
                    writeTextToButton({ text: 'Configure\nController', device: device, buttonIndex: 1 })
                    if (!currentController.core) {
                      updateStreamdecks({ type: 'connected', force: true })
                    }
                    device.controller.on('down', keyIndex => {
                      if (keyIndex === 1) {
                        open(`${config.get('connection') ? 'https:' : 'http:'}//${config.get('connection').host}/cores/${currentController.core}/realms/${currentController.realm}/config/controllers/${encodeURIComponent(currentController.id)}`)
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

      case 'update':
        if (panel) {
          const device = streamDecks.find(device => device.config.serial === serial)
          log('info', 'link/streamdeck', `Updating panel on ${device.config.id}`)
          device.controller.clearAllKeys()
          device.controller.removeAllListeners('down')
          device.controller.on('down', keyIndex => {
            handleButtonPress(device, keyIndex)
          })
          const buttons = []
          panel.buttons.map(row => { buttons.push(Object.keys(row).map((key) => { return row[key] })) })
          device.config.panel = { ...panel, buttons: buttons }
          writePanel({ panel: device.config.panel, device: device })
        } else {
          director.query(controllersQueryGQL)
            .toPromise()
            .then(result => {
              if (result.error) {
                log('error', 'link/streamdeck', result.error)
              } else {
                const device = streamDecks.find(device => device.config.serial === serial)
                log('info', 'link/streamdeck', `Updating panel on ${device.config.id}`)
                device.controller.clearAllKeys()
                device.controller.removeAllListeners('down')
                if (findIndex(result.data.controllers, controller => controller.serial === device.config.serial) === -1 || result.data.controllers[findIndex(result.data.controllers, controller => controller.serial === device.config.serial)].panel === undefined) {
                  writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
                  writeTextToButton({ text: 'Configure\nController', device: device, buttonIndex: 1 })
                  device.controller.on('down', keyIndex => {
                    if (keyIndex === 1) {
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
                    writeTextToButton({ text: 'Boreal\nDirector', device: device, buttonIndex: 0 })
                    writeTextToButton({ text: 'Configure\nController', device: device, buttonIndex: 1 })
                    if (!currentController.core) {
                      updateStreamdecks({ type: 'connected', force: true })
                    }
                    device.controller.on('down', keyIndex => {
                      if (keyIndex === 1) {
                        open(`${config.get('connection') ? 'https:' : 'http:'}//${config.get('connection').host}/cores/${currentController.core}/realms/${currentController.realm}/config/controllers/${encodeURIComponent(currentController.id)}`)
                        log('info', 'link/streamdeck', 'Opening Core Panel UI')
                      } else {
                        log('info', 'link/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
                      }
                    })
                  }
                }
              }
            })
        }
        break
    }
  }
}

export { registerStreamdecks, updateStreamdecks, streamDecks }
