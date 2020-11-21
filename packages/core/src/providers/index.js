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
                providers.push(module.default.providerRegistration)
                log('info', 'core/lib/providers', `Loaded ${module.default.providerRegistration.id} (${module.default.providerRegistration.label})`)
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
