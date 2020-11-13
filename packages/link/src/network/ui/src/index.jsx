import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { Provider, Client } from 'urql'
import View from './View.jsx'
import globalContext from './globalContext'

const client = new Client({
  url: '/graphql',
  requestPolicy: 'network-only',
  maskTypename: true
})

const App = () => {
  const darkClass = 'dx--dark'
  const lightClass = 'dx--light'

  const [theme, _setTheme] = useState(localStorage.getItem('uiTheme') || darkClass)

  const toggleTheme = () => {
    switch (theme) {
      case darkClass :
        document.body.classList.remove(darkClass)
        document.body.classList.add(lightClass)
        localStorage.setItem('uiTheme', lightClass)
        _setTheme(lightClass)
        break
      case lightClass :
        document.body.classList.remove(lightClass)
        document.body.classList.add(darkClass)
        localStorage.setItem('uiTheme', darkClass)
        _setTheme(darkClass)
        break
    }
  }

  return (
    <Provider value={client}>
      <globalContext.Provider value={{ theme, toggleTheme }}>
        <View />
      </globalContext.Provider>
    </Provider>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))
