import db from '../db'
import log from '../log'
import { remove, sortBy } from 'lodash'
import { devices } from '../devices'

import { providerInterfaces } from '../providers'

const stacks = []

const initStacks = () => {
  db.get('stacks').then((d) => {
    d.map((item, index) => {
      stacks.push(item)
    })
  })
}

const createNewStack = (newStack) => {
  stacks.push(newStack)
  db.set('stacks', stacks)
  log('info', 'core/lib/stacks', `Creating ${newStack.id} (${newStack.name})`)
}

const deleteStack = (_id) => {
  const removedStack = remove(stacks, (item) => {
    return item.id === _id
  })
  if (!stacks.find((item) => { return item.id === _id })) {
    log('info', 'core/lib/stacks', `Deleted ${_id} (${removedStack[0].name})`)
    db.set('stacks', stacks)
    return 'ok'
  } else {
    log('info', 'core/lib/stacks', `Deletion of ${_id} (${removedStack[0].name}) failed.`)
    return 'error'
  }
}

// TODO: Facilitate delays and step timings
const executeStack = (_id) => {
  log('info', 'core/lib/stacks', `Executing stack ${_id} (${stacks.find((stack) => { return stack.id === _id }).name})`)
  sortBy(stacks.find((stack) => { return stack.id === _id }).actions, [(o) => { return o.id }]).map((action) => {
    var device = devices.find((device) => { return device.id === action.deviceid })
    providerInterfaces[providerInterfaces.findIndex((providerInterface) => { return providerInterface.id === device.provider })].providerInterface(device.configuration, action.providerFunctionID, action.parameters)
  })
  return 'executed'
}

export { createNewStack, deleteStack, stacks, initStacks, executeStack }
