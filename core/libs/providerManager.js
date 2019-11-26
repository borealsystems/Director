import rosstalk from '../network/providers/rosstalk'

const ProviderManager = () => {}

ProviderManager.load = (dir) => {
  rosstalk.init()
}

export default ProviderManager
