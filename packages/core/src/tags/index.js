import log from '../utils/log'
import status from '../utils/statusEnum'
import { tags, stacks } from '../db'

const updateTag = tag => new Promise((resolve, reject) => {
  tags.findOneAndUpdate(
    { id: tag.id },
    {
      $set: {
        core: tag.core ? tag.core : process.env.DIRECTOR_CORE_CONFIG_LABEL,
        realm: tag.realm ? tag.realm : 'root',
        ...tag
      }
    },
    { upsert: true },
    (err, result) => {
      if (err) reject(err)
      log('info', 'core/tags', `Updated ${result.value.id} (${result.value.label})`)
      resolve(result.value)
    } 
  )
})

const deleteTag = id => new Promise((resolve, reject) => {
  stacks.updateMany(
    { tags: { $elemMatch: { id: id }}}, 
    {
      $pull: {
        tags: {
          id: id
        }
      }
    }
  )
    .then(() => tags.findOneAndDelete({ id: id }, (err, result) => {
      if (err) reject(err)
      log('info', 'core/tags', `Deleted Tag ${result.value.id} ${result.value.label}`)
    }))
    .catch(err => reject(err))
    .finally(() => resolve(status.OK))
})

export { updateTag, deleteTag }
