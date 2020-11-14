import log from '../utils/log'
import status from '../utils/statusEnum'
import shortid from 'shortid'
import { stacks } from '../db'
import { deviceInstance } from '../devices'
import { stackWaterfall } from '../utils/waterfall'

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
        stackWaterfall(stack)
        resolve(stack)
      })
      .catch(e => reject(e))
  })
}

const duplicateStack = _id => new Promise((resolve, reject) => {
  const id = shortid.generate()
  stacks.findOne({ id: _id })
    .then(stack => {
      delete stack._id
      return stack
    })
    .then(stack => {
      stacks.updateOne(
        { id: id },
        {
          $set: {
            ...stack,
            id: id,
            label: `Duplicate of ${stack.label}`
          }
        },
        { upsert: true }
      )
    })
    .then(resolve(id))
    .catch(err => reject(err))
})

const deleteStack = (_id) => {
  return new Promise((resolve, reject) => {
    stacks.findOne({ id: _id })
      .then(stack => {
        stacks.deleteOne({ id: _id })
        return stack
      })
      .then(stack => {
        log('info', 'core/lib/stacks', `Deleted Stack ${stack.id} (${stack.label})`)
        stackWaterfall(stack, true)
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
        log('info', 'core/lib/stacks', `Executing Stack ${stack.id} (${stack.label})`)
        stack.actions.map(action => {
          const params = {}
          action.parameters.map(param => { params[param.id] = param.value })
          deviceInstance[action.device.id].interface({ ...action, parameters: params })
        })
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

export { updateStack, duplicateStack, deleteStack, stacks, executeStack }
