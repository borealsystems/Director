import path from 'path'
import fs from 'fs'
import log from './log'

const persistantConfig = path.join(process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.config'), 'BorealSystems', 'DirectorLink', 'config.json')

const config = {
  _config: {},
  get: key => config._config[key],
  set: (key, value) => {
    config._config[key] = value
    fs.writeFile(persistantConfig, JSON.stringify(config._config), 'utf8', (err) => {
      if (err) log('error', 'link/utils/config', err)
    })
  },
  init: () => new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(persistantConfig), { recursive: true }, err => {
      if (err) reject(err)
      fs.readFile(persistantConfig, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            fs.writeFile(persistantConfig, JSON.stringify(config._config), 'utf8', (err) => {
              if (err) reject(err)
            })
            resolve(config._config)
          } else reject(err)
        } else {
          config._config = JSON.parse(data || '{}')
          resolve(config._config)
        }
      })
    })
  })
}

export { config }
