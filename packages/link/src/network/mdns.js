import { initGQLClient } from './graphql'
import log from '../utils/log'
const mdns = require('mdns')

let mdnsBrowser

const mdnsAdvertise = () => {
  const ad = mdns.createAdvertisement(mdns.tcp('director-bridge'), 4321)
  ad.start()
}

const directorCore = {}
const isIPv4 = new RegExp('^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\\.(?!$)|$)){4}$')

const getDirectorURIFromService = (service) => {
  let address = ''
  service.addresses.map(addr => { if (isIPv4.test(addr)) address = addr })
  return address
}

const mdnsWatch = (cb) => {
  mdnsBrowser = mdns.createBrowser(mdns.tcp('director-core'))
  mdnsBrowser.on('serviceUp', service => {
    if (!directorCore.service) {
      directorCore.address = getDirectorURIFromService(service)
      log('info', 'link/network/mdns', `Connecting to Director Core (${directorCore.address}) on ${service.networkInterface}`)
      directorCore.service = service
      initGQLClient(directorCore.address, directorCore.service.port)
    }
  })
  mdnsBrowser.start()
}

export { mdnsAdvertise, mdnsWatch, directorCore, mdnsBrowser }
