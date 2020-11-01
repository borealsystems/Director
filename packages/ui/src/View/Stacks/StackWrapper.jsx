import React from 'react'
import { useQuery } from 'urql'
import { Loading } from 'carbon-components-react'
import Stack from './Stack.jsx'

import GraphQLError from '../components/GraphQLError.jsx'

import { existingStackQueryGQL, newStackQueryGQL } from './queries'

const StackWrapper = ({ match: { params: { id } } }) => {
  const [result] = useQuery({
    query: id === 'new' ? newStackQueryGQL : existingStackQueryGQL,
    variables: id === 'new' ? null : { id: id }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) { return <Loading /> }
  if (result.data) { return <Stack id={id} _stack={result.data.stack} devices={result.data.devices} /> }
}

export default StackWrapper
