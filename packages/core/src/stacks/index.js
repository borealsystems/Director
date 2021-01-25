import log from '../utils/log'
import status from '../utils/statusEnum'
import shortid from 'shortid'
import { stacks, controllers } from '../db'
import { deviceInstance } from '../devices'
import { stackWaterfall } from '../utils/waterfall'
import { actionTimeouts } from '../utils/actionTimeouts'

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
        log('info', 'core/stacks', `${_stack.id ? 'Updated' : 'Created'} ${stack.id} (${stack.label})`)
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
        log('info', 'core/stacks', `Deleted Stack ${stack.id} (${stack.label})`)
        stackWaterfall(stack, true)
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

const executeStack = (_id, _controller) => {
  return new Promise((resolve, reject) => {
    stacks.findOne({ id: _id })
      .then(stack => {
        if (_controller === 'RossTalk') { log('info', 'core/stacks', `Executing Stack ${stack.id} (${stack.label}) via RossTalk`) }
        else if (_controller === 'Shotbox') { log('info', 'core/stacks', `Executing Stack ${stack.id} (${stack.label}) via Shotbox`) }
        else { log('info', 'core/stacks', `Executing Stack ${stack.id} (${stack.label})`) }
        stack.actions.map((action, index) => {
          const params = {}
          action.parameters.map(param => { params[param.id] = param.value })
          if (deviceInstance[action.device.id]) {
            actionTimeouts.add(() => {
              deviceInstance[action.device.id].interface({ ...action, parameters: params, controller: _controller })
            }, action.delay ?? 0)
          } else {
            log('warn', 'core/stacks', `${stack.id} (${stack.label}) action ${index + 1} failed, ${action.device.id} (${action.device.label}) not initialised`)
          }
        })
        resolve(status.OK)
      })
      .catch(e => reject(e))
  })
}

const executeAction = _action => new Promise(resolve => {
  log('info', 'core/stacks', `Executing Action ${_action.providerFunction.label} on ${_action.device.label}`)
  const params = {}
  _action.parameters?.map(param => { params[param.id] = param.value })
  if (deviceInstance[_action.device.id]) {
    deviceInstance[_action.device.id].interface({ ..._action, parameters: params, controller: null })
  } else {
    log('warn', 'core/stacks', `Action ${_action.providerFunction.label} on ${_action.device.label} failed, Device not initialised`)
  }
  resolve(status.OK)
})

export { updateStack, duplicateStack, deleteStack, stacks, executeStack, executeAction }
