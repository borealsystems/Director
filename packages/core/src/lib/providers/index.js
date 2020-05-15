import fs from 'fs'
import path from 'path'
import log from '../log.js'

const providers = []

const providerInterfaces = []
// TODO: ESlint really doesnt like this file
const initProviders = () => {
  fs.readdir(path.resolve(__dirname, './descriptors'), (err, files) => {
    files.forEach(file => {
      import(`./descriptors/${file}`)
        .then((module) => {
          module.default.init(providers, providerInterfaces)
          log('info', 'core/lib/providers', `Loaded provider: ${module.default.descriptor.label} `)
        })
     })
   })
}

export { initProviders, providerInterfaces, providers }
