import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { Query } from 'urql'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { get } from 'lodash'
import ProviderRequirements from './ProviderRequirements.jsx'

const NewDevice = (props) => {
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
  var [requirements] = useState({})

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
          <div className="inline-block w-full py-4 px-4 border-t border-l border-r border-gray-500">
            <div className="text-3xl py-2 -mt-4 px-2">Add A New Device</div>
            <div className="flex">
              <input className="flex-initial shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/3 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
                type="text"
                id="name"
                value={newDeviceName}
                onChange={(e) => {
                  setNewDeviceName(e.target.value, props.setNewDevice({ ...props.newDevice, name: e.target.value }))
                }}
                placeholder='Name' />
              <Dropdown
                className="flex-1"
                isselectedClassName="shadow appearance-none border border-gray-500 rounded bg-gray-700 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
                controlClassName="shadow appearance-none border border-gray-500 rounded bg-gray-700 mx-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
                menuClassName="shadow appearance-none border border-gray-500 rounded bg-gray-700 mt-1 text-white leading-tight focus:outline-none focus:border-white"
                options={data.definitionNames}
                value={newDevice}
                onChange={(e) => {
                  setNewDevice(e)
                  props.setNewDevice({ ...props.newDevice, definition: e.value })
                }
                }
                placeholder="Definition" />
            </div>
            {newDevice !== '' ? (
              <div className="w-full py-2 px-2">
                <div>Adding a new {data.definition.manufacturer} {data.definition.product}{newDeviceName !== '' ? (<span> with the name {newDeviceName} </span>) : (null)} </div>
                <div>This device uses <b>{data.definition.provider}</b> as its communications provider</div>
                {!data.providerRequirements.internal && (
                  <div>
                    <div className="text-2xl mt-4 -mb-4">Configuration</div>
                    <ProviderRequirements
                      providerRequirements={get(data.providerRequirements, data.definition.provider, [])}
                      requirements={requirements}
                      onChange={(req) => { props.setNewDevice({ ...props.newDevice, config: { ...props.newDevice.requirements, ...req } }) }}>
                    </ProviderRequirements>
                  </div>
                )}
              </div>
            ) : (null) }
          </div>
        )
      }}
    </Query>
  )
}

export default hot(module)(NewDevice)
