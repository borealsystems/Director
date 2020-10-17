//  eslint-disable
import fs from 'fs'
import path from 'path'
import log from '../utils/log.js'

const providers = []

const providerInterfaces = []

const providerInitMethods = []
const initProviders = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/providers', 'Loading Providers')
    fs.readdir(path.resolve(__dirname, './Library/protocolProviders'), (err, files) => {
      var counter = files.length
      files.forEach(file => {
        import(`./Library/protocolProviders/${file}`)
          .then((module) => {
            providers.push(module.default.providerRegistration)
            log('info', 'core/lib/providers', `Loaded ${module.default.providerRegistration.id} (${module.default.providerRegistration.label})`)
            counter--
            if (counter === 0) { 
              loadDeviceProviders()
            }
          })
        })
      })
      
      const loadDeviceProviders = () => {
        fs.readdir(path.resolve(__dirname, './Library/deviceProviders'), (err, files) => {
          var counter = files.length
          files.forEach(file => {
            import(`./Library/deviceProviders/${file}`)
            .then((module) => {
              providers.push(module.default.providerRegistration)
              log('info', 'core/lib/providers', `Loaded ${module.default.providerRegistration.id} (${module.default.providerRegistration.label})`)
              counter--
              if (counter === 0) { 
                resolve()
              }
            })
        })
      })
    }
  })
}

export { initProviders, providerInterfaces, providerInitMethods, providers }
