import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { useQuery } from 'urql'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import find from 'lodash/find'

// TODO: Create Actions

const ActionStep = (props) => {
  var [gql] = useQuery({ query: '{ getDevices getFunctions }', requestPolicy: 'network-only' })
  // var [functions, updateFunctions] = useQuery({ query: '{ getFunctions }', requestPolicy: 'network-only' })
  var [newAction, setNewAction] = useState({})

  if (gql.fetching) {
    return 'Loading...'
  } else if (gql.error) {
    return 'Oh no!'
  }

  var stepIndex = props.key

  return (
    <div className="border rounded p-2 my-2">
      <div className="flex">
        <div>
          {props.stepIndex}
        </div>
        <div>
          {props.steps[0].device} <br />
          {props.steps[0].function}
        </div>
      </div>
    </div>
  )
}

export default hot(module)(ActionStep)
