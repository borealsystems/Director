import { controllers, cores, devices, panels, stacks } from './db'
import { providers } from './providers'
import STATUS from './utils/statusEnum'
import log, { logs } from './utils/log'

const coreResolvers = {
  statusQueryResolver: () => {
    return ['success', 'All Systems Go', 'Director is operating as intended and is not reporting any errors.']
  },

  thisCoreQueryResolver: () => ({ id: process.env.DIRECTOR_CORE_ID, label: process.env.DIRECTOR_CORE_LABEL, timezone: process.env.TZ }),

  coresQueryResolver: async () => {
    return await cores.find({}).toArray()
  },

  realmsQueryResolver: () => new Promise((resolve, reject) => {
    const realmsArray = []
    cores.find({}).each((err, core) => {
      if (err) {
        reject(err)
      } else if (core == null) {
        resolve(realmsArray)
      } else {
        core.realms.map((realm) => {
          realmsArray.push({ ...realm, coreID: core.id, coreLabel: core.label })
        })
      }
    })
  }),

  realmQueryResolver: async (parent, args) => {
    const core = await cores.findOne({ id: args.core, 'realms.id': args.realm })
    return core.realms.find(realm => realm.id === args.realm)
  },

  logsQueryResolver: () => { return logs },

  providersQueryResolver: () => providers,

  globalColoursQueryResolver: () => [
    { id: '#da1e28', label: 'Red' },
    { id: '#D96120', label: 'Orange'},
    { id: '#C6A324', label: 'Yellow' },
    { id: '#24a148', label: 'Green' },
    { id: '#1a8978', label: 'Cyan'},
    { id: '#0043ce', label: 'Blue' },
    { id: '#AB20D9', label: 'Purple'},
    { id: '#D920B4', label: 'Pink'},
    { id: '#000000', label: 'Black'}
  ],

  dependentsQueryResolver: (parent, args) => {
    return new Promise((resolve, reject) => {
      const resolveArray = []
      switch (args.type) {
        case 'device':
          stacks.find({ actions: { $elemMatch: { 'device.id': args.id } } }).each((err, stack) => {
            if (err) {
              reject(err)
            } else if (stack == null) {
              resolve({ count: resolveArray.length, list: resolveArray })
            } else {
              resolveArray.push({ id: stack.id, label: stack.label, itemType: 'stack' })
            }
          })
          break
        case 'stack':
          panels.find({ buttons: { $elemMatch: { $elemMatch: { 'stack.id': args.id } } } }).each((err, panel) => {
            if (err) {
              reject(err)
            } else if (panel == null) {
              stacks.find({ actions: { $elemMatch: { parameters: { $elemMatch: { id: 'stack', 'value.id': args.id } } } } }).each((err, stack) => {
                if (err) {
                  reject(err)
                } else if (stack == null) {
                  resolve({ count: resolveArray.length, list: resolveArray })
                } else {
                  resolveArray.push({ id: stack.id, label: stack.label, itemType: 'stack' })
                }
              })
            } else {
              resolveArray.push({ id: panel.id, label: panel.label, itemType: 'panel' })
            }
          })
          break
        case 'panel':
          controllers.find({ 'panel.id': args.id }).each((err, controller) => {
            if (err) {
              reject(err)
            } else if (controller == null) {
              resolve({ count: resolveArray.length, list: resolveArray })
            } else {
              resolveArray.push({ id: controller.id, label: controller.label, itemType: 'controller' })
            }
          })
          break
      }
    })
  },

  coreMutationResolver: (parent, args) => {
    return new Promise((resolve, reject) => {
      cores.updateOne({ id: args.core.id }, { $set: args.core })
        .then(() => {
          return cores.findOne({ id: args.core.id })
        })
        .then(core => {
          resolve(core)
        })
    })
  },

  createRealmMutationResolver: (parent, args) => {
    return new Promise((resolve, reject) => {
      cores.updateOne(
        { id: args.realm.coreID },
        { $addToSet: { realms: { id: args.realm.id, label: args.realm.label, description: args.realm.description, notes: args.realm.notes } } }
      )
        .then(() => {
          log('info', 'core/network/graphql', `Created Realm ${args.realm.id} (${args.realm.label})`)
          resolve(STATUS.OK)
        })
    })
  },

  updateRealmMutationResolver: (parent, args) => {
    return new Promise((resolve, reject) => {
      cores.updateOne(
        { id: args.realm.coreID, 'realms.id': args.realm.id },
        { $set: { 'realms.$': { ...args.realm } } }
      )
        .then(() => {
          log('info', 'core/network/graphql', `Updated Realm ${args.realm.id} (${args.realm.label})`)
          resolve(STATUS.OK)
        })
    })
  },

  deleteRealmMutationResolver: (parent, args) => {
    return new Promise((resolve, reject) => {
      devices.updateMany({ core: process.env.DIRECTOR_CORE_ID, realm: args.realm.id }, { $set: { realm: 'ROOT' } })
      stacks.updateMany({ core: process.env.DIRECTOR_CORE_ID, realm: args.realm.id }, { $set: { realm: 'ROOT' } })
      panels.updateMany({ core: process.env.DIRECTOR_CORE_ID, realm: args.realm.id }, { $set: { realm: 'ROOT' } })
      controllers.updateMany({ core: process.env.DIRECTOR_CORE_ID, realm: args.realm.id }, { $set: { realm: 'ROOT' } })
      cores.updateOne(
        { id: args.realm.coreID },
        { $pull: { realms: { id: args.realm.id } } }
      )
        .then(() => {
          log('info', 'core/network/graphql', `Deleted Realm ${args.realm.id}`)
          resolve(STATUS.OK)
        })
    })
  }
}

export { coreResolvers } 
