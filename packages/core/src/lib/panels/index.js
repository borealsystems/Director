import db from '../db'
import log from '../utils/log'
import { findIndex, remove } from 'lodash'
import shortid from 'shortid'

const panels = []

const initPanels = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/panels', 'Initialising Panels')
    db.get('panels').then((d) => {
      if (d === undefined) {
        db.set('panels', {})
      } else {
        let counter = d.length
        d.map((item, index) => {
          panels.push(item)
          counter--
          if (counter === 0) { resolve() }
        })
      }
    })
  })
}

const cleanupPanels = () => {
}

const updatePanel = (_panel) => {
  switch (_panel.id !== undefined) {
    case true: {
      panels[findIndex(panels, item => item.id === _panel.id)] = { ...panels[panels.indexOf(item => item.id === _panel.id)], ..._panel }
      db.set('panels', panels)
      log('info', 'core/lib/panels', `Updating ${_panel.id} (${_panel.label})`)
      return _panel.id
    }
    case false: {
      const panel = { id: shortid.generate(), ..._panel }
      panels.push(panel)
      db.set('panels', panels)
      log('info', 'core/lib/panels', `Creating ${panel.id} (${panel.label})`)
      return panel
    }
  }
}

const deletePanel = (_id) => {
  if (_id === '0') {
    log('info', 'core/lib/panels', 'You Can\'t Delete BorealDirector from BorealDirector')
    return 'error'
  } else {
    let removedPanel = {}
    removedPanel = remove(panels, (item) => {
      return item.id === _id
    })
    if (!panels.find((item) => { return item.id === _id })) {
      log('info', 'core/lib/panels', `Deleted ${_id} (${removedPanel[0].label})`)
      db.set('panels', panels)
      return 'ok'
    } else {
      log('error', 'core/lib/panels', `Deletion of ${_id} (${removedPanel[0].label}) failed.`)
      return 'error'
    }
  }
}
export { updatePanel, deletePanel, panels, initPanels, cleanupPanels }
