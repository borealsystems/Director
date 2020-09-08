import { panels } from '../db'
import log from '../utils/log'
import shortid from 'shortid'

const initPanels = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/panels', 'Initialising Panels')
    resolve()
  })
}

const cleanupPanels = () => {
}

const updatePanel = (_panel) => {
  return new Promise((resolve, reject) => {
    const id = _panel.id ? _panel.id : shortid.generate()
    panels.updateOne(
      { id: id },
      {
        $set: {
          core: _panel.core ? _panel.core : process.env.DIRECTOR_CORE_CONFIG_LABEL,
          realm: _panel.realm ? _panel.realm : 'root',
          id: id,
          ..._panel
        }
      },
      { upsert: true }
    )
      .then(() => {
        return panels.findOne({ id: id })
      })
      .then(panel => {
        log('info', 'core/lib/panels', `${!panel.id ? 'Creating' : 'Updating'} ${panel.id} (${panel.label})`)
        resolve(panel)
      })
      .catch(e => reject(e))
  })
}

const deletePanel = (_id) => {
  return new Promise((resolve, reject) => {
    panels.findOne({ id: _id })
      .then(panel => {
        panels.deleteOne({ id: _id })
        return panel
      })
      .then(panel => {
        log('info', 'core/lib/panels', `Deleted panel ${panel.id} (${panel.label})`)
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

export { updatePanel, deletePanel, panels, initPanels, cleanupPanels }
