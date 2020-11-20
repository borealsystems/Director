class actionTimeouts {
  constructor (name) {
    this.name = name
  }

  static timeouts = [];
  static add (callback, timeout) {
    const id = setTimeout(() => {
      callback()
    }, timeout ?? 0)
    this.timeouts.push(id)
  }

  static clearAll () {
    let len = this.timeouts.length
    while (len > 0) {
      clearTimeout(this.timeouts.pop())
      len--
    }
  }
}

export { actionTimeouts }
