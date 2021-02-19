import { devices, stacks, tags } from '../db'
import { updateStack, duplicateStack, deleteStack, executeStack, executeAction} from '.'

const stackResolvers = {
  stacksQuery: (p, args) => new Promise((resolve, reject) => {
    const realmFilter = args.realm ? { realm: args.realm } : {}
    const coreFilter = args.core ? { core: args.core } : {}
    const resolveArray = []
    stacks
      .find({ ...realmFilter, ...coreFilter })
      .each((err, stack) => {
        if (err) {
          reject(err)
        } else if (stack == null) {
          resolve(resolveArray)
        } else {
          resolveArray.push({
            ...stack,
            ...stack.actions.map(action => {
              action.device = devices.findOne({ id: action.device.id })
            }),
            ...stack.tags?.map((tag, tagIndex) => {
              stack.tags[tagIndex] = tags.findOne({ id: tag, core: stack.core, realm: stack.realm })
            })
          })
        }
      })
  }),

  stackQuery: (parent, args) => {
    return new Promise((resolve, reject) => {
      stacks.findOne({ id: args.id })
        .then(stack => resolve({
          ...stack,
          ...stack.actions.map(action => {
            action.device = devices.findOne({ id: action.device.id })
          }),
          ...stack.tags?.map((tag, tagIndex) => {
            stack.tags[tagIndex] = tags.findOne({ id: tag, core: stack.core, realm: stack.realm })
          })
        }))
        .catch(e => reject(e))
    })
  },

  updateStackMutationResolver: (parent, args) => updateStack(args.stack),
  duplicateStackMutationResolver: (parent, args) => duplicateStack(args.id),
  deleteStackMutationResolver: (parent, args) => deleteStack(args.id),
  executeStackMutationResolver: (parent, args) => executeStack(args.id, args.controller),
  executeActionMutationResolver: (parent, args) => executeAction(args.action)
}

export { stackResolvers }
