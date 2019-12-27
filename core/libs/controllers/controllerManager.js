import { connectStreamDecks } from './providers/elgato-streamdeck'
import { controllers } from '../globals'

const debug = require('debug')('BorealDirector:core/libs/controllers')

const controllerManager = () => {} // Empty root Function

controllerManager.handleStreamdecks = () => {
  connectStreamDecks()
    .then(() => {
      controllers.forEach(element => {
        if (element.type === 'streamdeck') {
          element.device.clearAllKeys() // Clear everything at startup

          element.device.on('down', keyIndex => { // Handle button presses
            element.device.fillColor(keyIndex, 0, 0, 255)
            debug('Controller', element.uuid, 'button', keyIndex, 'pressed')
          })

          element.device.on('up', keyIndex => { // Handle button releases
            element.device.fillColor(keyIndex, 255, 255, 0)
            debug('Controller', element.uuid, 'button', keyIndex, 'released')
          })

          element.device.on('error', error => { // Handle Errors
            debug('Controller Error', error)
          })
        }
      })
    })
}

controllerManager.initControllers = () => {
  controllerManager.handleStreamdecks()
}

controllerManager.handleExit = () => {
  controllers.forEach(element => {
    if (element.type === 'streamdeck') {
      element.device.clearAllKeys() // Clear everything at startup
    }
  })
}

export default controllerManager
