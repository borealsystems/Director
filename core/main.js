import path from 'path'
import system from './libs/system'
import definitionManager from './libs/definitionManager'
import providerManager from './libs/providerManager'
import dbload from './libs/dbUtils'
import './network'
import './network/mdns'
import controllerManager from './libs/controllers/controllerManager'
import './libs/functionManager'

const debug = require('debug')('BorealDirector:core/main')

dbload()
system.on('db', (stream) => {
  debug(stream)
})

definitionManager.load(path.resolve('DefinitionLibrary'))
providerManager.load(path.resolve('core/network/providers'))
controllerManager.initControllers()

process.on('SIGINT', () => {
  controllerManager.handleExit()
  debug('SIGINT Recieved, shutting down BorealDirector:Core')
  process.exit()
})
