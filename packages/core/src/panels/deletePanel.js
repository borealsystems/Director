import { panels } from '../db'
import { panelWaterfall } from '../utils/waterfall'
import log from '../utils/log'

const deletePanel = (_id) => {
  return new Promise((resolve, reject) => {
    panels.findOne({ id: _id })
      .then(panel => {
        panels.deleteOne({ id: _id })
        return panel
      })
      .then(panel => {
        log('info', 'core/panels', `Deleted panel ${panel.id} (${panel.label})`)
        panelWaterfall(panel, true)
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

export default deletePanel
