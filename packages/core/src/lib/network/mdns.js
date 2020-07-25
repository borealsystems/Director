const mdns = require('mdns')

const initMDNS = () => {
  const ad = mdns.createAdvertisement(mdns.tcp('director-core'), 3000)
  ad.start()
}

export { initMDNS }
