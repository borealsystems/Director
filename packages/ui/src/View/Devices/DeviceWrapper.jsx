import React from 'react'
import { useQuery } from 'urql'
import { Loading } from 'carbon-components-react'
import Device from './Device.jsx'

import GraphQLError from '../components/GraphQLError.jsx'

import { existingDeviceQuery, newDeviceQuery } from './queries'

const DeviceWrapper = ({ match: { params: { id } } }) => {
  const [result] = useQuery({
    query: id === 'new' ? newDeviceQuery : existingDeviceQuery,
    variables: id === 'new' ? null : { id: id }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) { return <Loading /> }
  if (result.data) { return <Device id={id} result={result} /> }
}

export default DeviceWrapper
