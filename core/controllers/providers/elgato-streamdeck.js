import db from '../../libs/db'
import system from '../../libs/system'
import { findKey } from 'lodash'
const uuidBase62 = require('uuid-base62')
const { openStreamDeck, listStreamDecks } = require('elgato-stream-deck')
const debug = require('debug')('BorealDirector:core/controllers/elgato-streamdeck')

let itemsProcessed = 0
const uuidArray = []

const connectStreamDecks = () => {
  return new Promise((resolve, reject) => {
    const listOfStreamDecks = listStreamDecks()
    debug(`Loading ${listOfStreamDecks.length} StreamDeck(s)`)
    listOfStreamDecks.forEach(element => {
      debug('found', findKey(db.get('controllers'), { serial: element.serialNumber }))
      if (findKey(db.get('controllers'), { serial: element.serialNumber })) {
        uuidArray.push(findKey(db.get('controllers'), { serial: element.serialNumber }))
        itemsProcessed++
        if (itemsProcessed === listOfStreamDecks.length) {
          resolve(uuidArray)
        }
      } else {
        const uuid = uuidBase62.v4()
        db.put(`controllers.${uuid}.device`, openStreamDeck(element.path))
        db.put(`controllers.${uuid}.serial`, element.serialNumber)
        uuidArray.push(uuid)
        itemsProcessed++
        if (itemsProcessed === listOfStreamDecks.length) {
          resolve(uuidArray)
        }
      }
    })
  })
}

export { connectStreamDecks }
