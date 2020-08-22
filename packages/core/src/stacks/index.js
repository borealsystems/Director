import log from '../utils/log'
import shortid from 'shortid'
import { stacks } from '../db'
import { deviceInstance } from '../devices'

const initStacks = () => {
  return new Promise((resolve, reject) => {
    log('info', 'core/lib/stacks', 'Initialised Stacks')
  })
}

const updateStack = (_stack) => {
  const stack = { id: !_stack.id ? shortid.generate() : _stack.id, ..._stack }
  stacks.put(stack.id, stack)
  log('info', 'core/lib/stacks', `${!stack.id ? 'Creating' : 'Updating'} ${stack.id} (${stack.label})`)
  return _stack
}

const deleteStack = (_id) => {
  return new Promise((resolve, reject) => {
    stacks.get(_id)
      .then((value, err) => {
        if (err) log('error', 'core/lib/stacks', err)
        return value
      })
      .then(value => {
        stacks.del(_id)
        return value
      })
      .then(value => {
        log('info', 'core/lib/stacks', `Deleted Stack ${value.id} (${value.label})`)
        resolve(200)
      })
  })
}

// TODO: Facilitate delays and step timings WITH AN INTERNAL ACTION
// TODO: Deal with offline, inactive, and deleted devices
const executeStack = (_id) => {
  return new Promise((resolve, reject) => {
    stacks.get(_id)
      .then(stack => {
        stack.actions.map(action => {
          deviceInstance[action.device.id].interface(action)
        })
        log('info', 'core/lib/stacks', `Executed Stack: $${_id} (${stack.label})`)
      })
      .then(() => resolve(200))
      .catch(err => reject(err))
  })
}

export { updateStack, deleteStack, stacks, initStacks, executeStack }
