import { writeTextToButton } from '../graphics'
import log from '../../utils/log'
import buttonLUT from './buttonLUT'

const writePanel = ({ panel, device }) => {
  panel.buttons.map((row, rowIndex) => {
    row.map((button, buttonIndex) => {
      if (button.stack !== null) {
        try {
          writeTextToButton({ text: button.stack.panelLabel || button.stack.label, device: device, buttonIndex: buttonLUT[device.config.manufacturer][device.config.model].forward[rowIndex][buttonIndex], background: button.stack.colour?.id })
        } catch (e) {
          if (e.name === 'TypeError') {
          } else {
            log('warn', 'link/streamdeck/writePanel', `Error writing panel (${device.config.panel.id}, ${device.config.panel.label}) to device, panel is probably a different size: ${e}`)
          }
        }
      }
    })
  })
}

export default writePanel
