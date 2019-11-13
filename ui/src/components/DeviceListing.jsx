// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

class DefinitionList extends Component {
  constructor (props) {
    super(props)
    this.state = { definitionNames: ['Fake'] }
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
      body: JSON.stringify({ query: '{ definitionNames }' })
    })
      .then(r => r.json())
      .then(r => this.setState(r.data))
  }

  render () {
    return (
      <div className="container mx-auto">
        {this.state.definitionNames.map((key, index) => <div key={index}><span>{JSON.stringify(key).replace(/['"]+/g, '').replace(/[-]+/g, ' ')}</span></div>)}
      </div>
    )
  }
}

class DeviceListing extends Component {
  render () {
    return (
      <div className="container mx-auto">
        <br />
        <span className="text-xl font-bold pb-4">Devices</span><br />
        <span className="text-xl font-bold pb-4">Loaded Definitions:</span>
        <DefinitionList />
      </div>
    )
  }
}

export default hot(module)(DeviceListing)
