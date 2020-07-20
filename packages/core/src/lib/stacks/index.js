import db from '../db'
import log from '../utils/log'
import { remove, findIndex } from 'lodash'
import shortid from 'shortid'
import { devices } from '../devices'

const stacks = []

const initStacks = (cb) => {
  db.get('stacks').then((d) => {
    if (d === undefined) {
      stacks.push()
    } else {
      d.map((item, index) => {
        stacks.push(item)
      })
    }
  }).catch(e => console.log(e)).then(() => {
    if (typeof cb === 'function') {
      cb()
    }
  })
}

const updateStack = (_stack) => {
  var stack = {}
  switch (!_stack.id) {
    case false:
      stacks[findIndex(stacks, element => element.id === _stack.id)] = _stack
      log('info', 'core/lib/stacks', `Updating ${_stack.id} (${_stack.label})`)
      break
    case true:
      stack = { id: shortid.generate(), ..._stack }
      stacks.push(stack)
      log('info', 'core/lib/stacks', `Creating ${stack.id} (${stack.label})`)
      break
  }
  db.set('stacks', stacks)
  return _stack
}

const deleteStack = (_id) => {
  const removedStack = remove(stacks, (item) => {
    return item.id === _id
  })
  if (!stacks.find((item) => { return item.id === _id })) {
    log('info', 'core/lib/stacks', `Deleted stack ${_id} (${removedStack[0].label})`)
    db.set('stacks', stacks)
    return 'ok'
  } else {
    log('info', 'core/lib/stacks', `Deletion of ${_id} (${removedStack[0].label}) failed.`)
    return 'error'
  }
}

// TODO: Facilitate delays and step timings WITH AN INTERNAL ACTION
// TODO: Deal with offline, inactive, and deleted devices
const executeStack = (_id) => {
  log('info', 'core/lib/stacks', `Executing stack ${_id} (${stacks.find((stack) => { return stack.id === _id }).label})`)
  stacks.find((stack) => { return stack.id === _id }).actions.map((action) => {
    var device = devices.find((device) => { return device.id === action.device.id })
    device.instance.interface(action)
  })
  return 'executed'
}

export { updateStack, deleteStack, stacks, initStacks, executeStack }
