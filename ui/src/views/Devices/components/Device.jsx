import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { keys } from 'lodash'
import { useMutation } from 'urql'

const toggleProps = (showProperties, setShowProperties) => {
  setShowProperties(!showProperties)
}

const deleteDevice = (uuid, deleteDeviceMutationResult, deleteDeviceMutation, refreshContainer) => {
  confirm('Are you sure?\nThis cannot be undone and will break all actions that use this device')
  deleteDeviceMutation({ uuid: uuid }).then(deleteDeviceMutationResult => refreshContainer())
}

const deleteDeviceGQL = `
mutation deleteDevice($uuid: String!) {
  deleteDevice(uuid: $uuid)
}
`

const Device = (props) => {
  const [deleteDeviceMutationResult, deleteDeviceMutation] = useMutation(deleteDeviceGQL)
  const [showProperties, setShowProperties] = useState(false)

  return (
    <div key={props.index} className='bg-gray-300 dark:bg-gray-800'>
      <div className="text-center">
        <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">{props.device.name}</div>
        <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{props.uuid}</div>
        <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
          {showProperties ? (
            <button className="text-xs text-gray-500 uppercase" onClick={() => toggleProps(showProperties, setShowProperties)}>Less {'<'}</button>
          ) : (
            <button className="text-xs text-gray-500 uppercase" onClick={() => toggleProps(showProperties, setShowProperties)}>More ></button>
          )}
        </div>
      </div>
      {showProperties &&
      <div className="w-100 minh-64 py-2 px-2 border-l border-r border-t border-gray-500">
        <span>UUID: {props.uuid} </span><br/>
        <span>Name: {props.device.name} </span><br/>
        <span>Definition: {props.device.definition} </span><br/>
        <span>{props.device.config && `config: ${JSON.stringify(props.device.config)}`}</span>
        <div>
          <br/>
          {props.device.config && keys(props.device.config).map((key) => {
            return (
              <div key={key}>
                <span className="w-32">{key}</span>
                <input className="flex-initial shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/3 mb-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
                  type="text"
                  id={key}
                  value={props.device.config[key]}
                  // onChange={(e) => { props.onChange(objectify(req.id, e.target.value)) }}
                  // placeholder={req.label}
                />
                <br />
              </div>
            )
          })}
          {props.device.definition !== 'BorealDirector-Internal' &&
            <button className="flex-initial bg-red-600 dark:bg-red-700 font-bold text-gray-800 dark:text-gray-200 shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/6 mb-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white" onClick={() => deleteDevice(props.uuid, deleteDeviceMutationResult, deleteDeviceMutation, props.refreshContainer)}>Delete</button>
          }
        </div>
      </div>
      }
    </div>
  )
}

export default hot(module)(Device)
