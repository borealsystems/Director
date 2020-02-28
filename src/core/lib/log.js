import {
  blue,
  yellow,
  red,
  gray
} from 'chalk'
import nicelyFormat from 'nicely-format'
import createDebug from 'debug'

const logs = []

const time = () => {
  const now = new Date()
  const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
  return date.toISOString().replace(/.*T(.*)Z/, '$1')
}

const indentText = (text) => text.replace(/^(?!\s+$)/mg, ' '.repeat(13)).trim()

const logger = (
  {
    title,
    messages,
    logFunction
  }
) => {
  const formattedMessages = messages.map((message) => {
    if (typeof message === 'string') {
      return message
    }
    return nicelyFormat(message, {
      highlight: true,
      min: true,
      theme: {
        tag: 'cyan',
        content: 'reset',
        prop: 'yellow',
        value: 'green',
        number: 'green',
        string: 'reset',
        date: 'green',
        symbol: 'red',
        regex: 'red',
        function: 'blue',
        error: 'red',
        boolean: 'yellow',
        label: 'blue',
        bracket: 'grey',
        comma: 'grey',
        misc: 'grey',
        key: 'cyan'
      }
    })
  }).map(indentText)
  logFunction(gray(time()), `[${title}]`, ...formattedMessages)
}

const createLogger = (title,
  {
    debugFunction = createDebug(title),
    logFunction = console.log
  } = {}) => {
  return {
    debug (...messages) {
      logger({
        title: yellow(`DEBUG ${title}`),
        messages,
        logFunction: debugFunction
      })
    },
    info (...messages) {
      logger({
        title: blue(title),
        messages,
        logFunction
      })
    },
    warn (...messages) {
      logger({
        title: yellow(`WARNING ${title}`),
        messages,
        logFunction
      })
    },
    error (...messages) {
      logger({
        title: red(`ERROR ${title}`),
        messages,
        logFunction
      })
    },
    fatal (...messages) {
      logger({
        title: red(`========= FATAL ${title} =========`),
        messages,
        logFunction
      })
    },
    trace (...messages) {
      logger({
        title: red(`TRACE ${title}`),
        messages,
        logFunction
      })
    }

  }
}

const log = (level, path, message) => {
  const time = () => {
    const now = new Date()
    const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    return date.toISOString().replace(/.*T(.*)Z/, '$1')
  }
  logs.push({ id: logs.length.toString(), time: time(), level: level, path: path, message: message })
  switch (level) {
    case 'debug':
      createLogger(path).debug(message)
      break
    case 'info':
      createLogger(path).info(message)
      break
    case 'warn':
      createLogger(path).warn(message)
      break
    case 'error':
      createLogger(path).error(message)
      break
    case 'fatal':
      createLogger(path).fatal(message)
      break
    case 'trace':
      createLogger(path).trace(message)
      break
  }
}

export default log
export { logs }
