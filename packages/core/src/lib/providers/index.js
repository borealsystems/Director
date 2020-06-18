//  eslint-disable
import fs from 'fs'
import path from 'path'
import log from '../log.js'

const providers = []

const providerInterfaces = []
const initProviders = () => {
  fs.readdir(path.resolve(__dirname, './protocolProviders'), (err, files) => {
    files.forEach(file => {
      import(`./protocolProviders/${file}`)
        .then((module) => {
          module.default.init(providers, providerInterfaces)
          log('info', 'core/lib/providers', `Loaded provider: ${module.default.descriptor.label} `)
        })
     })
   })
   fs.readdir(path.resolve(__dirname, './deviceProviders'), (err, files) => {
    files.forEach(file => {
      import(`./deviceProviders/${file}`)
        .then((module) => {
          module.default.init(providers, providerInterfaces)
          log('info', 'core/lib/providers', `Loaded provider: ${module.default.descriptor.label} `)
        })
     })
   })
}

export { initProviders, providerInterfaces, providers }
