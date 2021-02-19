import { updateDevice, deleteDevice, disableDevice, enableDevice, deviceInstance } from '.'
import { providers } from '../providers'

const deviceResolvers = {
  devicesQueryResolver: async (p, args) => {
    const realmFilter = args.realm ? { realm: args.realm } : {}
    const coreFilter = args.core ? { core: args.core } : {}
    const devicesArray = await devices.find({ ...realmFilter, ...coreFilter }).toArray()
    const coresArray = args.realm === 'ROOT' ? [] : await devices.find({ 'provider.id': 'ProtocolProviderBorealDirector' }).toArray()
    return [...devicesArray.map(device => ({ ...device, provider: providers.find(provider => provider.id === device.provider.id) })), ...coresArray]
  },

  deviceQueryResolver: async (parent, args) => {
    const device = await devices.findOne({ id: args.id })
    return { ...device, provider: providers.find(provider => provider.id === device.provider.id) }
  },

  deviceFunctionsQueryResolver: (p, args) => {
    if (deviceInstance[args.id]) {
      if (typeof deviceInstance[args.id].providerFunctions === 'function') return deviceInstance[args.id].providerFunctions(args)
      else return deviceInstance[args.id].providerFunctions
    } else return []
  },

  deviceMutationResolver: (parent, args) => updateDevice(args.device),
  deleteDeviceMutationResolver: (parent, args) => deleteDevice(args.id),
  disableDeviceMutationResolver: (parent, args) => disableDevice(args.id),
  enableDeviceMutationResolver: (parent, args) => enableDevice(args.id)
}

export { deviceResolvers }