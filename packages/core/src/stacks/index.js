import log from '../utils/log'
import status from '../utils/statusEnum'
import shortid from 'shortid'
import { stacks } from '../db'
import { deviceInstance } from '../devices'

const initStacks = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/stacks', 'Initialised Stacks')
  })
}

const updateStack = (_stack) => {
  return new Promise((resolve, reject) => {
    const id = _stack.id ? _stack.id : shortid.generate()
    stacks.updateOne(
      { id: id },
      {
        $set: {
          core: _stack.core ? _stack.core : process.env.DIRECTOR_CORE_CONFIG_LABEL,
          realm: _stack.realm ? _stack.realm : 'root',
          id: id,
          ..._stack
        }
      },
      { upsert: true }
    )
      .then(() => {
        return stacks.findOne({ id: id })
      })
      .then(stack => {
        log('info', 'core/lib/stacks', `${_stack.id ? 'Updated' : 'Created'} ${stack.id} (${stack.label})`)
        resolve(stack)
      })
      .catch(e => reject(e))
  })
}

const deleteStack = (_id) => {
  return new Promise((resolve, reject) => {
    stacks.findOne({ id: _id })
      .then(stack => {
        stacks.deleteOne({ id: _id })
        return stack
      })
      .then(stack => {
        log('info', 'core/lib/stacks', `Deleted Stack ${stack.id} (${stack.label})`)
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

// TODO: Facilitate delays and step timings WITH AN INTERNAL ACTION
// TODO: Deal with offline, inactive, and deleted devices
const executeStack = (_id) => {
  return new Promise((resolve, reject) => {
    stacks.findOne({ id: _id })
      .then(stack => {
        stack.actions.map(action => {
          deviceInstance[action.device.id].interface(action)
        })
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

export { updateStack, deleteStack, stacks, initStacks, executeStack }
