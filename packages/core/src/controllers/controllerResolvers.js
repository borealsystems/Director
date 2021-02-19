import { updateController, deleteController, controllerLayouts } from '.'
import { controllers } from '../db'

const controllerResolvers = {
  controllerLayoutsQueryResolver: () => controllerLayouts,

  controllersQueryResolver: async (p, args) => {
    const realmFilter = args.realm ? { realm: args.realm } : {}
    const coreFilter = args.core ? { core: args.core } : {}
    return await controllers.find({ ...realmFilter, ...coreFilter }).toArray()
  },

  controllerQueryResolver: (parent, args) => {
    return new Promise((resolve, reject) => {
      controllers.findOne({ id: args.id })
        .then(controller => resolve(controller))
        .catch(e => reject(e))
    })
  },

  controllerMutationResolver: (parent, args) => updateController(args.controller),
  deleteControllerMutationResolver: (parent, args) => deleteController(args.id)
}

export { controllerResolvers }
