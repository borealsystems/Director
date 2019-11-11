// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class DeviceList extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate () {
    console.log(this.state)
  }

  componentDidMount () {
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query: '{ definitionList }' })
    })
      .then(r => r.json())
      .then(r => this.setState(r.data.definitionList))
  }

  render () {
    return (
      <p>{JSON.stringify(this.state)}</p>
    )
  }
}

class Devices extends Component {
  render () {
    return (
      <div className="container mx-auto w-100">
        <DeviceList />
      </div>
    )
  }
}

export default hot(module)(Devices)
