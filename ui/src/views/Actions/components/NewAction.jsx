import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader'
import { useQuery } from 'urql'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import find from 'lodash/find'

import ActionStep from './ActionStep'

// TODO: Create Actions

const NewAction = (props) => {
  var [gql] = useQuery({ query: '{ getDevices getFunctions }', requestPolicy: 'network-only' })
  var [newAction, setNewAction] = useState({})
  var [stepsElements, setStepsElements] = useState([])
  var [newStepDetails, setNewStepDetails] = useState({})

  useEffect(() => {
    // console.log('newAction', newAction)
    // console.log('stepsElements', stepsElements)
    console.log('newStepDetails', newStepDetails)
  })

  if (gql.fetching) {
    return 'Loading...'
  } else if (gql.error) {
    return 'Oh no!'
  }

  const dropdownDevices = () => {
    const options = []
    if (gql.data) {
      gql.data.getDevices.forEach(device => {
        options.push({ value: device.uuid, label: device.name })
      })
      return options
    } else return 'Loading...'
  }

  const dropdownFunctions = () => {
    const options = []
    if (gql.data && newStepDetails.device) {
      find(gql.data.getFunctions, { name: find(gql.data.getDevices, { uuid: newStepDetails.device }).definition }).functions
        .forEach(functions => {
          options.push({ value: functions.name, label: functions.label })
        })
      return options
    } else return ['Loading...']
  }

  const newStep = () => {
    setNewAction({ ...newAction, steps: [...stepsElements, { device: newStepDetails.device, function: newStepDetails.function }] })
      .then(setStepsElements([...stepsElements, <ActionStep steps={newAction.steps} key={stepsElements.length + 1}/>]))
  }

  return (
    <div className="border border-gray-500 rounded-b">
      <div className="inline-block bg-gray-200 dark:bg-gray-800 border-b border-gray-500 w-full py-4 px-4">
        <div className="text-3xl py-2 -mt-4 px-2">Add A New Action</div>
        <div className="flex">
          <span className="flex-initial mx-1 py-2 px-1 text-gray-900 dark:text-white">Name</span>
          <input className="flex-initial appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 w-1/3 mx-2 py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:border-white"
            type="text"
            id="name"
            value={newAction.name}
            onChange={(e) => {
              setNewAction({ name: e.target.value, ...newAction })
            }}
            placeholder='' />
        </div><br /><hr />
        <div className="text-xl py-2 px-2">Action Steps</div>

        {stepsElements}

        <div className="flex">
          <Dropdown
            className="flex-1"
            isselectedClassName="appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 mx-2 py-2 px-3 text-gray-800 dark:text-white leading-tight focus:outline-none focus:border-white"
            controlClassName="appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 mx-2 py-2 px-3 text-gray-800 dark:text-white leading-tight focus:outline-none focus:border-white"
            menuClassName="appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 mt-1 text-gray-800 dark:text-white leading-tight focus:outline-none focus:border-white"
            options={dropdownDevices()}
            value={newStepDetails.device}
            onChange={(e) => {
              setNewStepDetails(prevState => { return { ...prevState, device: e.value } })
            }}
            placeholder="Device" />
          <Dropdown
            className="flex-1"
            isselectedClassName="appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 mx-2 py-2 px-3 text-gray-800 dark:text-white leading-tight focus:outline-none focus:border-white"
            controlClassName="appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 mx-2 py-2 px-3 text-gray-800 dark:text-white leading-tight focus:outline-none focus:border-white"
            menuClassName="appearance-none border border-gray-500 rounded bg-gray-300 dark:bg-gray-700 mt-1 text-gray-800 dark:text-white leading-tight focus:outline-none focus:border-white"
            options={dropdownFunctions()}
            value={newStepDetails.function}
            onChange={(e) => {
              setNewStepDetails({ ...newStepDetails, function: e.value })
            }}
            placeholder="Function" />
          <button className="flex-initial w-32 bg-teal-500 border py-1 px-4 mx-2 rounded border-gray-500" onClick={() => { newStep() }}>Add A Step</button>
        </div>
      </div>
      <div className="inline-block w-5/6 py-2 px-2"></div>
      <div className="inline-block w-1/6">
        <button className="w-full bg-teal-500 py-2 px-2 h-10 font-bold rounded-br border-l border-gray-500" onClick={() => { props.toggleNewActionVisability() }}>Cancel</button>
      </div>
    </div>
  )
}

export default hot(module)(NewAction)
