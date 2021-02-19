import { panels, stacks } from '../db'

const getPanel = id => new Promise((resolve, reject) => {
  panels.findOne({ id: id })
    .then(panel => {
      panel.buttons.map(row => row.map(button => {
        button.stack && (button.stack = stacks.findOne({id: button.stack.id}))
      }))
      resolve(panel)
    })
    .catch(e => reject(e))
})

export default getPanel
