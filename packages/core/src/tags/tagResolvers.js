import { tags } from '../db'
import { updateTag, deleteTag } from '.'

const tagResolvers = {
  tagsQueryResolver: async (p, args) => {
    const realmFilter = args.realm ? { realm: args.realm } : {}
    const coreFilter = args.core ? { core: args.core } : {}
    return await tags.find({ ...realmFilter, ...coreFilter }).toArray()
  },

  updateTagMutationResolver: (parent, args) => updateTag(args.tag),
  deleteTagMutationResolver: (parent, args) => deleteTag(args.id)
}

export { tagResolvers }