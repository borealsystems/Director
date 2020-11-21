import osc from 'osc'
import { devices } from '../../db'
import log from '../../utils/log'
import STATUS from '../../utils/statusEnum'
import REGEX from '../../utils/regexEnum'

class ConnectionProviderOSC {
  constructor (_device) {
    this.device = _device
  }

  static parameters = [
    {
      id: 'host',
      label: 'Host',
      required: true,
      regex: REGEX.HOST
    },
    {
      id: 'port',
      label: 'UDP Port',
      required: true,
      regex: REGEX.PORT
    }
  ]

  init = () => {
    this.client = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: 0,
      metadata: true
    })
    this.client.open()
    this.client.on('error', (error) => {
      log('error', `virtual/device/${this.device.id} (${this.device.label})`, error)
    })
    devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.OK } })
  }

  destroy = (callback) => {
    if (this.client) {
      this.client.close()
      this.client = null
    }
    if (typeof callback === 'function') {
      callback()
    }
  }

  recreate = () => {}

  connectionProviderInterface = ({ address, args }) => {
    this.client.send(
      {
        address: address,
        args: args
      },
      this.device.configuration.host,
      this.device.configuration.port
    )
  }
}

export default ConnectionProviderOSC
