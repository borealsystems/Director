// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class Status extends Component {
  render () {
    return (
      <div className="container mx-auto w-100">
        <h1>Status Component</h1>
      </div>
    )
  }
}

export default hot(module)(Status)
