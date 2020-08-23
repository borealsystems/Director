import { core } from '../db'
const mdns = require('mdns')

let ad

const initMDNS = () => {
  core.get('config')
    .then(value => {
      if (ad) ad.stop()
      ad = mdns.createAdvertisement(mdns.tcp('director-core'), value.port)
      ad.start()
    })
}

export { initMDNS }
