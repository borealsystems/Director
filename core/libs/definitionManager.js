import path from 'path'
import system from './system'
import { endsWith } from 'lodash'
import { definitions } from '../libs/globals'
const debug = require('debug')('BorealDirector:core/libs/definitionManager')
const fs = require('fs')

const definitionManager = () => {}

definitionManager.load = (dir) => {
  fs.readdir(dir, (err, files) => {
    let numFiles = files.length - 3 // Ignore Git, License, and Readme
    if (err) debug(err)
    files.forEach((element) => {
      if (endsWith(element, '.json')) { // only parse JSONs
        debug('Loading', element)
        fs.readFile(path.resolve(dir, element), 'utf8', (err, data) => {
          if (err) debug(err)
          definitions.push(JSON.parse(data)) // Push definitions to the array
          numFiles++
          if (numFiles === files.length) {
            debug('Loaded All Definitions')
            system.emit('definitionsLoaded') // Let the system know we are done here
          }
        })
      }
    })
  })
}

export default definitionManager
