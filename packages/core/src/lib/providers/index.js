//  eslint-disable
import fs from 'fs'
import path from 'path'
import log from '../utils/log.js'

const providers = []

const providerInterfaces = []

const providerInitMethods = []
const initProviders = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/providers', 'Initialising Providers')
    fs.readdir(path.resolve(__dirname, './protocolProviders'), (err, files) => {
      var counter = files.length
      files.forEach(file => {
        import(`./protocolProviders/${file}`)
          .then((module) => {
            module.load(providers)
            counter --
            if (counter === 0) { 
              loadDeviceProviders()
            }
          })
      })
    })
  
    const loadDeviceProviders = () => {
      fs.readdir(path.resolve(__dirname, './deviceProviders'), (err, files) => {
        var counter = files.length
        files.forEach(file => {
          import(`./deviceProviders/${file}`)
            .then((module) => {
              module.default(providers)
              counter --
              if (counter === 0) { 
                resolve()
              }
            })
        })
      })
    }
  })
}

// TODO: Implement Provider Cleanup for TCP based protocols

const cleanupProviders = () => {
  log('warn', 'core/lib/providers', `Clearing TCP providers`)
}

export { initProviders, cleanupProviders, providerInterfaces, providerInitMethods, providers }
