import { director } from '../../network/graphql'
import buttonLUT from './buttonLUT'
import log from '../../utils/log'

const executeStackMutationGQL = `mutation executeStack($id: String, $controller: String) {
  executeStack(id: $id, controller: $controller)
}`

const handleButtonPress = (device, index) => {
  // Totally readable, goes through LUT and translates the button ID for the specified device to the row/column IDs, and then returns the stack ID from the panel
  const stack = device.config.panel.buttons[buttonLUT[device.config.manufacturer][device.config.model].reverse[index].row][buttonLUT[device.config.manufacturer][device.config.model].reverse[index].column].stack
  if (stack !== null) {
    director.query(executeStackMutationGQL, { id: stack.id, controller: `${device.config.manufacturer}-${device.config.model}-${device.config.serial}` })
      .toPromise()
      .then(result => {
        if (result.error) {
          log('info', 'link/streamdeck/handleButtonPress', result.error)
        } else {
          log('info', 'link/streamdeck/handleButtonPress', `Executed Stack ${stack.id} (${stack.label})`)
        }
      })
  }
}

export default handleButtonPress
