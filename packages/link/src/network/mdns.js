import { initGQLClient } from './graphql'
import { initStreamDecks } from '../streamdeck'
import log from '../utils/log'
const mdns = require('mdns')

const mdnsAdvertise = () => {
  const ad = mdns.createAdvertisement(mdns.tcp('director-bridge'), 4321)
  ad.start()
}

let directorCore = {}
const isIPv4 = new RegExp('^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\\.(?!$)|$)){4}$')

const getDirectorURIFromService = (service) => {
  let address = ''
  service.addresses.map(addr => { if (isIPv4.test(addr)) address = addr })
  return address
}

const mdnsWatch = (cb) => {
  const browser = mdns.createBrowser(mdns.tcp('director-core'))
  browser.on('serviceUp', service => {
    if (!directorCore.service) {
      directorCore.address = getDirectorURIFromService(service)
      log('info', 'link/src/network/mdns', `Connecting to Director Core ${directorCore.address} on ${service.networkInterface}`)
      initGQLClient(`http://${directorCore.address}:${service.port}/gql`)
      directorCore.service = service
      initStreamDecks()
    }
  })
  browser.on('serviceDown', service => {
    if (directorCore.service?.networkInterface === service.networkInterface) {
      log('error', 'link/src/network/mdns', `Lost connection to Core ${directorCore.address} on ${service.networkInterface}`)
      directorCore = {}
      initStreamDecks()
    }
  })
  browser.start()
}

export { mdnsAdvertise, mdnsWatch, directorCore }
