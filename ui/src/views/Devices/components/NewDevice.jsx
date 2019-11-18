import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { findIndex, merge } from 'lodash'

class NewDevice extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newDevice: {
        definitionIndex: 0,
        name: '',
        selected: { value: 'BorealSystems-DirectorInternal', label: 'BorealSystems-DirectorInternal' }
      },
      definitionNames: ['BorealSystems-DirectorInternal'],
      definitions: [
        {
          name: 'BorealSystems-DirectorInternal',
          manufacturer: 'Boreal Systems',
          product: 'Director',
          productVersion: '1.0.0',
          version: '1.0.0',
          communicationProvider: 'internal',
          type: 'orchestration',
          functions: []
        }
      ]
    }
    // this._onDropdownSelect = this._onDropdownSelect.bind(this)
  }

  componentDidUpdate () {
    console.log(this.state)
    // this.props.newDevice(this.state.newDevice)
  }

  componentDidMount () {
    this.setState({ newDevice: { selected: '', definitionIndex: findIndex(this.state.definitions, { name: 'BorealSystems-DirectorInternal' }) } })

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query: '{ definitionNames, definitions }' })
    })
      .then(r => r.json())
      .then(r => this.setState(r.data))
  }

  _onDropdownSelect (option) {
    this.setState(merge(this.state, { newDevice: { selected: option, definitionIndex: findIndex(this.state.definitions, { name: option.label }) } }))
  }

  _handleNameChange (event) {
    console.log(event)
    this.setState(merge(this.state, { newDevice: { name: event.target.value } }))
  }

  render () {
    const defaultOption = this.state.newDevice.selected
    const options = this.state.definitionNames

    return (
      <div className="inline-block w-full py-4 px-4 border-t border-l border-r border-gray-500">
        <div className="text-2xl py-2 -mt-4 px-2">Add A New Device</div>
        <div className="flex">
          <input className="flex-initial shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/3 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
            type="text"
            id="name"
            value={this.state.newDevice.name}
            onChange={this._handleNameChange.bind(this)}
            placeholder="Name" />
          <Dropdown
            className="flex-1"
            controlClassName="shadow appearance-none border border-gray-500 rounded bg-gray-700 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
            options={options}
            value={defaultOption}
            onChange={this._onDropdownSelect.bind(this)}
            placeholder="Definition" />
        </div>
        {defaultOption !== '' ? (
          <div className="w-full py-2 px-2">
            <div>Adding a new {this.state.definitions[this.state.newDevice.definitionIndex].manufacturer} {this.state.definitions[this.state.newDevice.definitionIndex].product} with the name {this.state.newDevice.name}</div>
            <div>This device uses {this.state.definitions[this.state.newDevice.definitionIndex].communicationProvider}</div>
          </div>
        ) : (null) }
      </div>
    )
  }
}

export default hot(module)(NewDevice)
