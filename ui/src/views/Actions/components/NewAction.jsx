import React from 'react'
import { hot } from 'react-hot-loader'

const NewAction = (props) => {
  return (
    <div className="bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center font-bold border border-gray-500 rounded-b-lg">
      <div>
        <div className="bg-gray-300 dark:bg-gray-800 text-center border-gray-500 border-b">
          <div className="inline-block w-full py-2 px-2">You have no configured actions. Click <span className="font-bold">New</span> to add one.</div>
        </div>
        <div className="inline-block w-5/6 py-2 px-2"></div>
        <div className="inline-block w-1/6 ">
          <button className="w-full bg-teal-500 py-2 px-2 h-10 font-bold rounded-br-lg border-l border-r border-gray-500" onClick={() => { props.toggleNewActionVisability() }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default hot(module)(NewAction)
