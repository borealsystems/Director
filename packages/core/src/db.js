import log from './utils/log'
import level from 'level'
import path from 'path'

log('info', 'core/lib/db', 'Loading Databases')

const core = level(path.join(__dirname, '../db/core'), { createIfMissing: true, valueEncoding: 'json' }, error => {
  if (error) {
    log('error', 'core/lib/db', error)
  } else {
    log('info', 'core/lib/db', 'Loaded DB: Core')
  }
})

const devices = level(path.join(__dirname, '../db/devices'), { createIfMissing: true, valueEncoding: 'json' }, err => {
  if (err) {
    log('error', 'core/lib/db', err)
  } else {
    log('info', 'core/lib/db', 'Loaded DB: Devices')
  }
})

const stacks = level(path.join(__dirname, '../db/stacks'), { createIfMissing: true, valueEncoding: 'json' }, err => {
  if (err) {
    log('error', 'core/lib/db', err)
  } else {
    log('info', 'core/lib/db', 'Loaded DB: Stacks')
  }
})

const panels = level(path.join(__dirname, '../db/panels'), { createIfMissing: true, valueEncoding: 'json' }, err => {
  if (err) {
    log('error', 'core/lib/db', err)
  } else {
    log('info', 'core/lib/db', 'Loaded DB: Panels')
  }
})

const controllers = level(path.join(__dirname, '../db/controllers'), { createIfMissing: true, valueEncoding: 'json' }, err => {
  if (err) {
    log('error', 'core/lib/db', err)
  } else {
    log('info', 'core/lib/db', 'Loaded DB: Controllers')
  }
})

export { core, devices, stacks, panels, controllers }
