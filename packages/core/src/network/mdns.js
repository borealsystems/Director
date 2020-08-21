import { port } from './express'
const mdns = require('mdns')

const initMDNS = () => {
  const ad = mdns.createAdvertisement(mdns.tcp('director-core'), port)
  ad.start()
}

export { initMDNS }
