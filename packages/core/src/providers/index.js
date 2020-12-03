import fs from 'fs'
import path from 'path'
import log from '../utils/log.js'
const SerialPort = require('serialport')

const providers = []

const providerInterfaces = []

const providerInitMethods = []

let isSerial = false

const initProviders = () => {
  return new Promise((resolve, reject) => {
    SerialPort.list().then(d => isSerial = d.length > 0)
    log('info', 'core/lib/providers', 'Loading Providers')
    fs.readdir(path.resolve(__dirname, './protocolProviders'), (err, files) => {
      if (err) log('error', 'core/lib/providers', err)
      var counter = files.length
      files.forEach(file => {
        import(`./protocolProviders/${file}`)
          .then((module) => {
            providers.push(module.default.providerRegistration)
            log('info', 'core/lib/providers', `Loaded ${module.default.providerRegistration.id} (${module.default.providerRegistration.label})`)
            counter--
            if (counter === 0) { 
              loadDeviceProviders()
            }
          })
          .catch(err => log('error', 'core/lib/providers', err))
        })
      })
      
      const loadDeviceProviders = () => {
        fs.readdir(path.resolve(__dirname, './deviceProviders'), (err, directories) => {
          if (err) log('error', 'core/lib/providers', err)
          var counter = directories.length
          directories.forEach(directory => {
            import(`./deviceProviders/${directory}`)
              .then((module) => {
                if (module.default.providerRegistration.protocol === 'Serial' && !isSerial) {
                  log('info', 'core/lib/providers', `Skipping ${module.default.providerRegistration.id} (${module.default.providerRegistration.label}) as this system has no Serial Interfaces`)
                }
                else {
                  providers.push(module.default.providerRegistration)
                  log('info', 'core/lib/providers', `Loaded ${module.default.providerRegistration.id} (${module.default.providerRegistration.label})`)
                }
                counter--
                if (counter === 0) { 
                  resolve()
                }
              })
              .catch(err => log('error', 'core/lib/providers', err))
        })
      })
    }
  })
}

export { initProviders, providerInterfaces, providerInitMethods, providers }
