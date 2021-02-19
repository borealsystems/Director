import { panels } from '../db'
import { panelWaterfall } from '../utils/waterfall'
import log from '../utils/log'
import shortid from 'shortid'

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
        log('info', 'core/panels', `${!panel.id ? 'Created' : 'Updated'} ${panel.id} (${panel.label})`)
        panelWaterfall(panel)
        resolve(panel)
      })
      .catch(e => reject(e))
  })
}

export default updatePanel
