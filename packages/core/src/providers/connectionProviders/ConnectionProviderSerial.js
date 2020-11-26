import { devices } from '../../db'
import log from '../../utils/log'
import STATUS from '../../utils/statusEnum'
const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

class ConnectionProviderSerial {
  constructor (_device) {
    this.device = _device
  }

  static getItems = () => new Promise(resolve => {
    SerialPort.list().then(data => resolve([...data.map((port, index) => ({ id: index, label: port.path, ...port }))]))
  })

  static parameters = [
    {
      inputType: 'comboBox',
      id: 'port',
      label: 'Serial Port',
      required: true,
      placeholder: 'Select a Serial Port',
      tooltip: 'This device\'s connection provider needs to connect via a local serial port.',
      items: this.getItems()
    }
  ]

  init = () => {
    this.serialport = new SerialPort(this.device.configuration.port.path, { baudRate: 9600 }, error => {
      if (error) {
        log('error', `virtual/device/${this.device.id} (${this.device.label})`, `${error}`)
        devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.ERROR } })
      }
    })
    this.parser = new Readline()
    this.serialport.pipe(this.parser)
    this.serialport.write('TERMINAL OFF\r\n', (error) => {
      if (error) {
        log('error', `virtual/device/${this.device.id} (${this.device.label})`, `${error}`)
        devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.CONNECTING } })
      } else {
        devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.OK } })
      }
    })

    this.serialport.on('error', error => {
      log('error', `virtual/device/${this.device.id} (${this.device.label})`, `${error}`)
      devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.ERROR } })
    })
  }

  destroy = (callback) => {
    log('info', `virtual/device/${this.device.id} (${this.device.label})`, 'Destroying Instance')
  }

  recreate = () => {
    this.destroy()
    this.init()
  }

  connectionProviderInterface = ({ message }) => {
    this.serialport.write(`${message}\r\n`, (error) => {
      if (error) {
        log('error', `virtual/device/${this.device.id} (${this.device.label})`, `${error}`)
        devices.updateOne({ id: this.device.id }, { $set: { status: STATUS.ERROR } })
      }
    })
  }
}

export default ConnectionProviderSerial
