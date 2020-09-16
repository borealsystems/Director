import React from 'react'

const globalContext = React.createContext({
  realm: {},
  setRealm: () => {}
})

export default globalContext
