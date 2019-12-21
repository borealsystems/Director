import { connectStreamDecks } from './providers/elgato-streamdeck'
import db from '../libs/db'

const debug = require('debug')('BorealDirector:core/controllers/controllerManager')

connectStreamDecks()
  .then(
    (uuidArray) => {
      uuidArray.forEach(element => {
        db.get(`controllers.${element}.device`).on('up', keyIndex => {
          debug(element, keyIndex, 'up')
        })
        db.get(`controllers.${element}.device`).on('down', keyIndex => {
          debug(element, keyIndex, 'down')
        })
        db.get(`controllers.${element}.device`).on('error', error => {
          console.error(error)
        })
      })
      debug(uuidArray)
    }
  )
