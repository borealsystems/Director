const omit = require('lodash/omit')

export default function omitDeep (input, props) {
  const omitDeepOnOwnProps = (obj) => {
    if (typeof input === 'undefined') {
      return input
    }

    if (!Array.isArray(obj) && !isObject(obj)) {
      return obj
    }

    if (Array.isArray(obj)) {
      return omitDeep(obj, props)
    }

    const o = {}
    for (const [key, value] of Object.entries(obj)) {
      o[key] = !isNil(value) ? omitDeep(value, props) : value
    }

    return omit(o, props)
  }

  if (arguments.length > 2) {
    props = Array.prototype.slice.call(arguments).slice(1)
  }

  if (Array.isArray(input)) {
    return input.map(omitDeepOnOwnProps)
  }

  return omitDeepOnOwnProps(input)
}

const isNil = (value) => {
  return value === null || value === undefined
}

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
