import React from 'react'
import { hot } from 'react-hot-loader'
import { set, get } from 'lodash'

const objectify = (k, v) => {
  var o = {}
  set(o, k, v)
  return o
}

const ProviderRequirements = (props) => {
  return (
    <div>
      <br/>
      {props.providerRequirements.map((req, key) =>
        <div key={key}>
          <input className="flex-initial shadow appearance-none border border-gray-500 rounded bg-gray-700 w-1/3 mb-2 py-2 px-3 text-white leading-tight focus:outline-none focus:border-white"
            type="text"
            id={req.id}
            pattern={req.regex}
            value={get(props.requirements, `${req}.id`)}
            onChange={(e) => { props.onChange(objectify(req.id, e.target.value)) }}
            placeholder={req.label} />
          <br />
        </div>
      )}
    </div>
  )
}

export default hot(module)(ProviderRequirements)
