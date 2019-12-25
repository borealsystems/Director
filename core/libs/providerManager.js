import { initRosstalk } from '../network/providers/rosstalk'

const ProviderManager = () => {}

ProviderManager.load = (dir) => {
  initRosstalk()
}

export default ProviderManager
