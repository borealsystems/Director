import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { keys } from 'lodash'
import { useMutation } from 'urql'
import { useAlert } from 'react-alert'

const deleteDeviceGQL = `
mutation deleteDevice($uuid: String!) {
  deleteDevice(uuid: $uuid)
}
`

const Device = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [deleteDeviceMutationResult, deleteDeviceMutation] = useMutation(deleteDeviceGQL)
  const [showProperties, setShowProperties] = useState(false)
  const alert = useAlert()

  const toggleProps = () => {
    setShowProperties(!showProperties)
  }

  const deleteDevice = () => {
    if (confirm('Are you sure?\nThis cannot be undone and will break all actions that use this device')) {
      deleteDeviceMutation({ uuid: props.device.uuid }).then(props.refreshContainer())
      if (deleteDeviceMutationResult.data !== false) {
        alert.success({ title: 'Device Deleted', content: `${props.device.name}\n${props.device.uuid}` })
      }
    }
  }

  return (
    <div key={props.index} className='bg-gray-300 dark:bg-gray-800'>
      <div className="text-center">
        <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">{props.device.name}</div>
        <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{props.device.uuid}</div>
        <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
          {showProperties ? (
            <button className="text-xs text-gray-500 uppercase" onClick={() => toggleProps()}>Less {'<'}</button>
          ) : (
            <button className="text-xs text-gray-500 uppercase" onClick={() => toggleProps()}>More ></button>
          )}
        </div>
      </div>
      {showProperties &&
      <div className="w-100 minh-64 py-2 px-2 border-l border-r border-t border-gray-500">
        <span>UUID: {props.device.uuid} </span><br/>
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
            <div className="flex pt-6">
              <span className="flex-1"></span>
              <button className="flex-none w-48 bg-gray-400 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-500 rounded py-1 px-2 mr-2" onClick={() => { toggleProps() } }>Cancel</button>
              <button className="flex-none w-48 bg-green-600 dark:bg-green-700 text-gray-800 dark:text-gray-200 border border-gray-500 rounded py-1 px-2 mr-2" onClick={() => null }>Update</button>
              <button className="flex-none w-48 bg-red-600 dark:bg-red-700 text-gray-800 dark:text-gray-200 border border-gray-500 rounded py-1 px-2" onClick={() => deleteDevice()}>Delete</button>
            </div>
          }
        </div>
      </div>
      }
    </div>
  )
}

export default hot(module)(Device)
