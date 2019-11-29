import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader'
import { useQuery, Query } from 'urql'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { get } from 'lodash'

const merge = require('deepmerge')

const _onDropdownSelect = (option) => {
  runQuery(
    `query DEFINITION ($definitionName: String) {
      definition(definitionName: $definitionName)
    }`,
    { definitionName: option.value }
  )
    .then(r => this.setState(merge.all([this.state, { newDevice: { selected: option } }, { definition: r.data.definition }]), () => { this._updateProviderRequirements(this.state.definition.provider) }))
    // .then(this.setState(merge(this.state, { newDevice: { selected: option } })))
    // .then(this._updateProviderRequirements(this.state.definition.provider))
}

const _handleNameChange = (event) => {
  console.log(event)
  this.setState(merge(this.state, { newDevice: { name: event.target.value } }))
}

const NewDevice = () => {
  var definitionNames = useQuery({
    query: '{ definitionNames }'
  })
  var [newDevice, setNewDevice] = useState({
    value: 'BorealSystems-DirectorInternal',
    label: 'BorealSystems-DirectorInternal'
  })
  var [newDeviceName, setNewDeviceName] = useState('')
  var [definition, setDefinition] = useState({
    name: 'BorealSystems-DirectorInternal',
    manufacturer: 'Boreal Systems',
    product: 'Director',
    productVersion: '1.0.0',
    version: '1.0.0',
    provider: 'internal',
    type: 'orchestration',
    functions: []
  })

  // useEffect(() => {
  //   console.log()
  // })

  return (
    <Query query={`
    query getAll($definitionName: String, $providerName: String) {
      definitionNames
      definition(definitionName: $definitionName)
      providerRequirements(provider: $providerName)
    }`
    } variables={{ definitionName: newDevice.value, providerName: definition.provider }}>
      {({ fetching, data, error, extensions }) => {
        if (fetching) {
          return (
            <div className="inline-block w-full h-64 py-4 px-4 border-t border-l border-r border-gray-500">
              <div className="text-2xl py-2 -mt-4 px-2">Loading</div>
            </div>
          )
        } else if (error) {
          return (
            <div className="inline-block w-full h-64 py-4 px-4 border-t border-l border-r border-gray-500">
              <div className="text-2xl py-2 -mt-4 px-2">Error</div>
              <div></div>
            </div>
          )
        }

        setDefinition(data.definition)

        return (
          <div className="inline-block w-full h-64 py-4 px-4 border-t border-l border-r border-gray-500">
            <div className="text-2xl py-2 -mt-4 px-2">Add A New Device</div>
            <div className="flex">
              <input className="flex-initial shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/3 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
                type="text"
                id="name"
                value={newDeviceName}
                onChange={(e) => { setNewDeviceName(e.target.value) }}
                placeholder='Name' />
              <Dropdown
                className="flex-1"
                controlClassName="shadow appearance-none border border-gray-500 rounded bg-gray-700 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
                options={data.definitionNames}
                value={newDevice}
                onChange={(e) => setNewDevice(e)}
                placeholder="Definition" />
            </div>
            {newDevice !== '' ? (
              <div className="w-full py-2 px-2">
                <div>Adding a new {data.definition.manufacturer} {data.definition.product}{newDeviceName !== '' ? (<span> with the name {newDeviceName} </span>) : (null)} </div>
                <div>This device uses <b>{data.definition.provider}</b> as its communications provider</div>
                {get(data.providerRequirements, data.definition.provider, []).map((req, index) =>
                  <li key={index}>{req}</li>
                )}
              </div>
            ) : (null) }
          </div>
        )
      }}
    </Query>
  )
}

// class NewDevice extends Component {
//   constructor (props) {
//     super(props)
//     this.placeholder = 'Name'
//     this.reqList = []
//     this.state = {
//       newDevice: {
//         name: '',
//         selected: { value: 'BorealSystems-DirectorInternal', label: 'BorealSystems-DirectorInternal' }
//       },
//       providerRequirements: { internal: ['ip'] },
//       definition: {
//         name: 'BorealSystems-DirectorInternal',
//         manufacturer: 'Boreal Systems',
//         product: 'Director',
//         productVersion: '1.0.0',
//         version: '1.0.0',
//         provider: 'internal',
//         type: 'orchestration',
//         functions: []
//       }
//     }
//   }

//   componentDidUpdate () {
//     console.log(this.state)
//   }

//   componentDidMount () {
//     client.runQuery(
//       `query definitionNames {
//         definitionNames
//       }`
//     )
//       // eslint-disable-next-line no-sequences
//       .then(r => this.setState(merge(this.state, { definitionNames: r.data.definitionNames })))
//   }

//   _updateProviderRequirements (provider) {
//     return new Promise((resolve, reject) => {
//       client.runQuery(
//         `query providerRequirements ($providerName: String) {
//           providerRequirements(provider: $providerName)
//         }`,
//         { providerName: provider }
//       )
//         .then(s => this.setState(merge(this.state, s.data, () => {
//           get(this.state, `providerRequirements.${this.state.definition.provider}`).map((req, index) =>
//             this.reqList.push(<li key={index}>{req}</li>)
//           )
//         })))
//         .then(resolve())
//         .catch(e => reject(e))
//     })
//   }

//   _onDropdownSelect (option) {
//     client.runQuery(
//       `query DEFINITION ($definitionName: String) {
//         definition(definitionName: $definitionName)
//       }`,
//       { definitionName: option.value }
//     )
//       .then(r => this.setState(merge.all([this.state, { newDevice: { selected: option } }, { definition: r.data.definition }]), () => { this._updateProviderRequirements(this.state.definition.provider) }))
//       // .then(this.setState(merge(this.state, { newDevice: { selected: option } })))
//       // .then(this._updateProviderRequirements(this.state.definition.provider))
//   }

//   _handleNameChange (event) {
//     console.log(event)
//     this.setState(merge(this.state, { newDevice: { name: event.target.value } }))
//   }

//   render () {
//     const defaultOption = this.state.newDevice.selected

//     return (
//       <div className="inline-block w-full py-4 px-4 border-t border-l border-r border-gray-500">
//         <div className="text-2xl py-2 -mt-4 px-2">Add A New Device</div>
//         <div className="flex">
//           <input className="flex-initial shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/3 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
//             type="text"
//             id="name"
//             value={this.state.newDevice.name}
//             onChange={this._handleNameChange.bind(this)}
//             placeholder={this.placeholder} />
//           <Dropdown
//             className="flex-1"
//             controlClassName="shadow appearance-none border border-gray-500 rounded bg-gray-700 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
//             options={this.state.definitionNames}
//             value={defaultOption}
//             onChange={this._onDropdownSelect.bind(this)}
//             placeholder="Definition" />
//         </div>
//         {defaultOption !== '' ? (
//           <div className="w-full py-2 px-2">
//             <div>Adding a new {get(this.state, 'definition.manufacturer')} {get(this.state, 'definition.product')}{this.state.newDevice.name !== '' ? (<span> with the name {this.state.newDevice.name} </span>) : (null)} </div>
//             <div>This device uses <b>{this.state.definition.provider}</b> as its communications provider</div>
//             {get(this.state, `providerRequirements.${this.state.definition.provider}`).map((req, index) =>
//               <li key={index}>{req}</li>
//             )}
//           </div>
//         ) : (null) }
//       </div>
//     )
//   }
// }

export default hot(module)(NewDevice)
