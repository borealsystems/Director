import React from 'react'

const globalContext = React.createContext({
  realmContext: {},
  setContextRealm: () => {},
  theme: '',
  toggleTheme: () => {}
})

export default globalContext
