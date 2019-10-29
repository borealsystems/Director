// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import logo from '../../public/assets/logo.png'

class Hero extends Component {
  render () {
    return (
      <div className="block w-2/3 mx-auto">
        <img src={logo} />
      </div>
    )
  }
}

export default hot(module)(Hero)
