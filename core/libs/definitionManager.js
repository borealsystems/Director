import path from 'path'
import system from './system'
import definitions from './sharedVars'
const debug = require('debug')('BorealDirector:core/libs/definitionManager')
const fs = require('fs-extra')

const definitionManager = () => {}

definitionManager.load = (dir) => {
  fs.readdir(dir)
    .then((listing) => {
      debug(listing)
      listing.forEach((definitionName, obj) => {
        if (RegExp(/\.(json)/g).test(definitionName)) {
          debug(`Loading Definition: ${definitionName.replace(/\.[^/.]+$/, '')}`)
          fs.readJson(path.join(dir, definitionName))
            .then((stream) => {
              definitions.push(stream)
            })
            .catch((e) => debug(e))
        }
      })
    })
    .then(() => {
      debug(definitions.arr)
      system.emit('definitionsLoaded')
    })
    .catch((e) => e)
}

export default definitionManager
