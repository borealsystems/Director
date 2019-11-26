import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Client, setDefaultClient } from 'micro-graphql-react'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { merge, get } from 'lodash'

const client = new Client({
  endpoint: 'http://localhost:3001/graphql'
})

setDefaultClient(client)

class NewDevice extends Component {
  constructor (props) {
    super(props)
    this.placeholder = 'Name'
    this.state = {
      newDevice: {
        name: '',
        selected: { value: 'BorealSystems-DirectorInternal', label: 'BorealSystems-DirectorInternal' }
      },
      providerRequirements: { internal: ['ip'] },
      definition: {
        name: 'BorealSystems-DirectorInternal',
        manufacturer: 'Boreal Systems',
        product: 'Director',
        productVersion: '1.0.0',
        version: '1.0.0',
        provider: 'internal',
        type: 'orchestration',
        functions: []
      }
    }
  }

  componentDidUpdate () {
    console.log(this.state)
  }

  componentDidMount () {
    client.runQuery(
      `query definitionNames {
        definitionNames
      }`
    )
      .then(r => this.setState({ definitionNames: r.data.definitionNames, newDevice: { name: '', selected: '' } }))
  }

  _updateProviderRequirements (provider) {
    return new Promise((resolve, reject) => {
      client.runQuery(
        `query providerRequirements ($providerName: String) {
          providerRequirements(provider: $providerName)
        }`,
        { providerName: provider }
      )
        .then(s => this.setState(merge(this.state, s.data)))
        .then(resolve())
        .catch(e => reject(e))
    })
  }

  _onDropdownSelect (option) {
    client.runQuery(
      `query DEFINITION ($definitionName: String) {
        definition(definitionName: $definitionName)
      }`,
      { definitionName: option.value }
    )
      .then(r => this.setState(merge(this.state, r.data)))
      .then(this.setState(merge(this.state, { newDevice: { selected: option } })))
      .then(this._updateProviderRequirements(this.state.definition.provider))
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
            placeholder={this.placeholder} />
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
            <div>Adding a new {get(this.state, 'definition.manufacturer')} {get(this.state, 'definition.product')}{this.state.newDevice.name !== '' ? (<span> with the name {this.state.newDevice.name} </span>) : (null)} </div>
            <div>This device uses <b>{this.state.definition.provider}</b> as its communications provider</div>
            {this.state.providerRequirements !== null ? (
              <div> {JSON.stringify(get(this.state, `providerRequirements.${this.state.definition.provider}`))}</div>
            ) : (null) }
          </div>
        ) : (null) }
      </div>
    )
  }
}

export default hot(module)(NewDevice)
