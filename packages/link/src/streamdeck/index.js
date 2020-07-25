import { director } from '../network/graphql'
import { textImage } from '../utils/textImage'
import { directorCore } from '../network/mdns'
import { findIndex } from 'lodash'
import path from 'path'
import log from '../utils/log'
import os from 'os'
const open = require('open')
const sharp = require('sharp')

const { listStreamDecks, openStreamDeck } = require('elgato-stream-deck')

const streamDecks = []

const updateBridgeMutationGQL = `
mutation updateBridge($bridge: bridgeUpdateInputType) {
  updateBridge(bridge: $bridge)
}`

const writeTextToButton = ({ text, device, buttonIndex, background, color }) => {
  textImage({
    text: text,
    width: device.controller.ICON_SIZE,
    height: device.controller.ICON_SIZE,
    background: background || '#000000',
    color: color || 'white'
  })
    .then(_buffer => {
      device.controller.fillImage(buttonIndex, _buffer.slice(50, 19250))
    })
}

const initStreamDecks = () => {
  const allStreamDecks = listStreamDecks()
  allStreamDecks.map(device => {
    if (findIndex(streamDecks, (streamdeck) => streamdeck.path === device.path) === -1) {
      device.controller = openStreamDeck(device.path)
      device.config = { manufacturer: 'elgato', model: device.model, serial: device.serialNumber }
      streamDecks.push(device)
    }
  })

  streamDecks.map(device => {
    device.configured = false
    device.controller.clearAllKeys()
    if (!directorCore.address) {
      sharp(path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
        .flatten()
        .resize(device.controller.ICON_SIZE, device.controller.ICON_SIZE)
        .raw()
        .toBuffer()
        .then(buffer => {
          device.controller.fillImage(0, buffer)
        })
        .catch(err => {
          console.error(err)
        })
      writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
      writeTextToButton({ text: 'Core Offline', device: device, buttonIndex: 2 })
    } else if (device.configured === false) {
      sharp(path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
        .flatten()
        .resize(device.controller.ICON_SIZE, device.controller.ICON_SIZE)
        .raw()
        .toBuffer()
        .then(buffer => {
          device.controller.fillImage(0, buffer)
        })
        .catch(err => {
          console.error(err)
        })
      writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
      writeTextToButton({ text: 'Assign To Panel', device: device, buttonIndex: 2 })
      device.controller.on('down', keyIndex => {
        if (keyIndex === 2) {
          open(`http://${directorCore.address}:${directorCore.service.port}/config/controllers`)
          log('info', 'link/src/streamdeck', 'Opening Core Panel UI')
        } else {
          log('info', 'link/src/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
        }
      })

      console.log([...streamDecks.map(sd => { return sd.config })])
      director.query(updateBridgeMutationGQL, { bridge: { type: 'DirectorLink', address: os.networkInterfaces()[directorCore.service.networkInterface][1].address, version: '1.0.0', controllers: [...streamDecks.map(sd => { return sd.config })] } })
        .toPromise()
        .then(result => {
          log('info', 'link/src/streamdeck', result.data)
        })
    } else {
      sharp(path.resolve(__dirname, '../../../common/logos/Dark_Icon.svg'))
        .flatten()
        .resize(device.controller.ICON_SIZE, device.controller.ICON_SIZE)
        .raw()
        .toBuffer()
        .then(buffer => {
          device.controller.fillImage(0, buffer)
        })
        .catch(err => {
          console.error(err)
        })
      writeTextToButton({ text: 'Boreal Director', device: device, buttonIndex: 1 })
      writeTextToButton({ text: 'PANEL ASSIGNED', device: device, buttonIndex: 1 })

      device.controller.on('down', keyIndex => {
        log('info', 'link/src/streamdeck', `${device.serialNumber} Press: ${keyIndex}`)
      })

      device.controller.on('up', keyIndex => {
        log('info', 'link/src/streamdeck', `${device.serialNumber} Release: ${keyIndex}`)
      })

      director.query(updateBridgeMutationGQL, { controller: { manufacturer: 'elgato', model: device.model, serialNumber: device.serialNumber } })
        .toPromise()
        .then(result => {
          log('info', 'link/src/streamdeck', result.data)
        })
    }

    device.controller.on('error', error => {
      log('error', 'link/src/streamdeck', error)
    })
  })
}

export { initStreamDecks }
