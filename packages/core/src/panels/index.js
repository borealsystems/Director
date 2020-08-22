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
  const panel = { id: !_panel.id ? shortid.generate() : _panel.id, ..._panel }
  panels.put(panel.id, panel)
  log('info', 'core/lib/panels', `${!panel.id ? 'Creating' : 'Updating'} ${panel.id} (${panel.label})`)
  return _panel
}

const deletePanel = (_id) => {
  return new Promise((resolve, reject) => {
    panels.get(_id)
      .then((value, err) => {
        if (err) log('error', 'core/lib/panels', err)
        return value
      })
      .then(value => {
        panels.del(_id)
        return value
      })
      .then(value => {
        log('info', 'core/lib/panels', `Deleted panel ${value.id} (${value.label})`)
        resolve(200)
      })
  })
}

export { updatePanel, deletePanel, panels, initPanels, cleanupPanels }
