import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { useQuery } from 'urql'
// eslint-disable-next-line no-unused-vars
import { GraphQLJSONObject } from 'graphql-type-json'

import Action from './components/Action.jsx'
import NewAction from './components/NewAction'

const Actions = () => {
  var [actions, updateActions] = useQuery({ query: '{ actions }', requestPolicy: 'network-only' })
  var [newActionVisability, setNewActionVisability] = useState(false)

  const toggleNewActionVisability = () => {
    setNewActionVisability(!newActionVisability)
  }

  return (
    <div className="w-100 bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded">
      <div className="text-center font-bold border border-gray-500 border-b-0 rounded-t">
        <div className="inline-block w-3/6 py-2 px-2">Actions</div>
        <div className="inline-block w-1/6 py-2 px-2"></div>
        <div className="inline-block w-1/3 py-2 px-2">
          <input className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-white" id="username" type="text" placeholder="Search" />
        </div>
      </div>

      <div className="bg-gray-400 dark:bg-gray-700 text-center font-bold border border-gray-500 border-b-0">
        <div className="inline-block w-3/6 py-2 px-2">Name</div>
        <div className="inline-block w-1/3 py-2 px-2">UUID</div>
        <div className="inline-block w-1/6 py-2 px-2">Edit</div>
      </div>

      {!actions.fetching &&
        actions.data.actions.length !== 0 &&
        actions.data.actions.map((value, index) => {
          return (<Action action={value} key={index} refreshContainer={() => { updateActions() }}/>)
        })
      }

      {!actions.fetching &&
        actions.data.actions.length === 0 &&
        !newActionVisability &&
          <div className="bg-gray-300 dark:bg-gray-800 text-center border border-gray-500 border-b-0">
            <div className="inline-block w-full py-2 px-2">You have no configured actions. Click <span className="font-bold">New</span> to add one.</div>
          </div>
      }

      {!newActionVisability &&
        <div className="bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center font-bold border border-gray-500 rounded-b">
          <div>
            <div className="inline-block w-5/6 py-2 px-2"></div>
            <div className="inline-block w-1/6 ">
              <button className="w-full bg-teal-500 py-2 px-2 h-10 font-bold rounded-br border-l border-gray-500" onClick={() => { toggleNewActionVisability() }}>New</button>
            </div>
          </div>
        </div>
      }

      {newActionVisability &&
        <NewAction toggleNewActionVisability={() => { toggleNewActionVisability() }}/>
      }

    </div>
  )
}

export default hot(module)(Actions)
