import path from 'path'
import system from './system'
import { definitions } from '../libs/sharedVars'
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
            .then((defintionContents) => {
              definitions.push(defintionContents)
            })
            .catch((e) => debug(e))
        }
      })
    })
    .then(() => {
      debug(definitions)
      system.emit('definitionsLoaded')
    })
    .catch((e) => e)
}

export default definitionManager
