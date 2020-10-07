import React from 'react'

const globalContext = React.createContext({
  realmContext: {},
  setContextRealm: () => {}
})

export default globalContext
