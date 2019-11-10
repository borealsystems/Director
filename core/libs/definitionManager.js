import path from 'path'
import system from './system'
const debug = require('debug')('BorealDirector:core/libs/definitionManager')
const fs = require('fs-extra')

const definitions = [null]

const definitionManager = () => {}

definitionManager.load = (dir) => {
  fs.readdir(dir)
    .then((listing) => {
      debug(listing)
      listing.forEach((definitionName, obj) => {
        debug(`Loading Definition: ${definitionName.replace(/\.[^/.]+$/, '')}`)
        fs.readJson(path.join(dir, definitionName))
          .then((stream) => {
            definitions.push(stream)
          })
      })
    })
    .then(() => {
      debug(definitions)
      system.emit('definitionsLoaded')
    })
    .catch((e) => e)
}

export default definitionManager
