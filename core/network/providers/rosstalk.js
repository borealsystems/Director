import TCPClient from './tcp'
import { ProviderRequirements } from '../../libs/globals.js'

const requirements = {
  rosstalk: [
    {
      id: 'ip',
      label: 'IP Address',
      regex: '\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
    },
    {
      id: 'port',
      label: 'Port',
      regex: '(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[0-9]{1,4})$|^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[0-9]{1,4})$'
    }
  ]
}

class Rosstalk extends TCPClient {}

const initRosstalk = () => {
  ProviderRequirements.push(requirements)
}

export default Rosstalk
export { initRosstalk, requirements }
