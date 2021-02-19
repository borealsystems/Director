import { panels } from '../db'
import { getPanel, updatePanel, deletePanel } from '.'

const panelResolvers = {
  panelsQuery: async (parent, args) => {
    const realmFilter = args.realm ? { realm: args.realm } : {}
    const coreFilter = args.core ? { core: args.core } : {}
    return await panels.find({ ...realmFilter, ...coreFilter }).toArray()
  },

  panelQuery: (parent, args) => getPanel(args.id),
  panelMutationResolver: (parent, args) => updatePanel(args.panel),
  deletePanelMutationResolver: (parent, args) => deletePanel(args.id)
}

export { panelResolvers }
