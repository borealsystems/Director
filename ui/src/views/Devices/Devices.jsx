import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { useQuery, useMutation } from 'urql'
import { keys } from 'lodash'
// eslint-disable-next-line no-unused-vars
import { GraphQLJSONObject } from 'graphql-type-json'

import Device from './components/Device.jsx'
import NewDevice from './components/NewDevice.jsx'

const handleCancel = (setNewDevice, setShowNewDevice) => {
  setNewDevice({})
  setShowNewDevice(false)
}

const handleSubmit = (newDevice, setNewDevice, setShowNewDevice, newDeviceMutationResult, newDeviceMutation) => {
  newDeviceMutation({ definition: newDevice.definition, name: newDevice.name, config: newDevice.config }).then(console.log(newDeviceMutationResult))
  // setNewDevice({})
  // setShowNewDevice(false)
}

const addNewDeviceGQL = `
  mutation newDevice($name: String!, $definition: String!, $config: JSONObject) {
    newDevice(name: $name, definition: $definition, config: $config)
  }
`

const Devices = () => {
  var [devices, updateDevices] = useQuery({ query: '{ devices }', requestPolicy: 'network-only' })
  var [showNewDevice, setShowNewDevice] = useState(false)
  var [newDevice, setNewDevice] = useState({ ok: true })
  var [newDeviceMutationResult, newDeviceMutation] = useMutation(addNewDeviceGQL)

  return (
    <div className="w-100 bg-gray-400 dark:bg-gray-700 text-gray-900 rounded-lg dark:text-gray-100">
      <div className="text-center font-bold border border-gray-500 border-b-0 rounded-t-lg">
        <div className="inline-block w-3/6 py-2 px-2">Devices</div>
        <div className="inline-block w-1/6 py-2 px-2"></div>
        <div className="inline-block w-1/3 py-2 px-2">
          <input className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-white" id="username" type="text" placeholder="Search" />
        </div>
      </div>

      <div className="bg-gray-400 dark:bg-gray-700 text-center font-bold border border-gray-500 border-b-0">
        <div className="inline-block w-3/6 py-2 px-2">Name</div>
        <div className="inline-block w-1/3 py-2 px-2">UUID</div>
        <div className="inline-block w-1/6 py-2 px-2"></div>
      </div>

      {!devices.fetching &&
        keys(devices.data.devices).map((key) => {
          return <Device device={devices.data.devices[key]} key={key} uuid={key} refreshContainer={() => { updateDevices() }}/>
        })
      }

      {showNewDevice ? (<NewDevice newDevice={newDevice} setNewDevice={setNewDevice}/>) : (null)}

      <div className="bg-gray-700 text-center font-bold border border-gray-500 rounded-b-lg">
        {showNewDevice ? (
          <div>
            <div className="inline-block w-4/6 py-2 px-2"></div>
            <div className="inline-block w-1/6 ">
              <button
                className="py-2 px-2 ml-px h-10 border-l border-gray-500 w-full"
                onClick={
                  () => handleCancel(setNewDevice, setShowNewDevice)
                }>
                Cancel
              </button>
            </div>
            <div className="inline-block w-1/6 ">
              <button
                // disabled={!newDevice.ok}
                className={!newDevice.ok ? 'bg-grey-900 text-gray-500 py-2 px-2 ml-px h-10 rounded-br-lg border-l border-r border-gray-500 w-full' : 'bg-indigo-900 py-2 px-2 ml-px h-10 rounded-br-lg border-l border-r border-gray-500 w-full'}
                onClick={
                  () => {
                    handleSubmit(newDevice, setNewDevice, setShowNewDevice, newDeviceMutationResult, newDeviceMutation)
                    setNewDevice({ ok: true })
                    setShowNewDevice(false)
                    updateDevices({ requestPolicy: 'network-only' })
                  }
                }>
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="inline-block w-5/6 py-2 px-2"></div>
            <div className="inline-block w-1/6 ">
              <button className="bg-indigo-900 py-2 px-2 ml-px h-10 rounded-br-lg border-l border-r border-gray-500 w-full" onClick={() => setShowNewDevice(true)}>New</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default hot(module)(Devices)
