import React from 'react'

const globalContext = React.createContext({
  theme: '',
  toggleTheme: () => {}
})

export default globalContext
