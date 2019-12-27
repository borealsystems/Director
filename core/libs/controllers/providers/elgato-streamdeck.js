import db from '../../db'
import { find } from 'lodash'
import { controllers } from '../../globals'
const uuidBase62 = require('uuid-base62')
const { openStreamDeck, listStreamDecks } = require('elgato-stream-deck')
const debug = require('debug')('BorealDirector:core/controllers/elgato-streamdeck')

let itemsProcessed = 0

// TODO: Fix this pile of crap
// TODO: Replace with a RFP server

const connectStreamDecks = () => {
  return new Promise((resolve, reject) => {
    const listOfStreamDecks = listStreamDecks() // List em all
    debug(`Loading ${listOfStreamDecks.length} StreamDeck(s)`)
    listOfStreamDecks.forEach(element => {
      if (find(db.get('controllers'), { serialNumber: element.serialNumber })) {
        controllers.push({ uuid: find(db.get('controllers'), { serialNumber: element.serialNumber }).uuid, type: 'streamdeck', model: element.model, device: openStreamDeck(element.path) })
        itemsProcessed++
        if (itemsProcessed === listOfStreamDecks.length) {
          resolve()
        }
      } else {
        const uuid = uuidBase62.v4()
        controllers.push({ uuid: uuid, type: 'streamdeck', subtype: element, device: openStreamDeck(element.path) })
        db.put('controllers', [...db.get('controllers'), { uuid: uuid, type: 'streamdeck', model: element.model, serialNumber: element.serialNumber }])
        itemsProcessed++
        if (itemsProcessed === listOfStreamDecks.length) {
          resolve()
        }
      }
    })
  })
}

export { connectStreamDecks }
