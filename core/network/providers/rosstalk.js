import TCPClient from './tcp'
import { ProviderRequirements } from '../../libs/globals.js'
const debug = require('debug')('BorealDirector:core/network/rosstalk')

const requirements = { rosstalk: ['ip', 'port'] }

const rosstalk = (host, port, command) => {
  debug(requirements)
  const tcp = new TCPClient(host, port)
  tcp.send(command)
}

rosstalk.init = () => {
  ProviderRequirements.push(requirements)
  debug(ProviderRequirements)
}

export default rosstalk
export { requirements }
