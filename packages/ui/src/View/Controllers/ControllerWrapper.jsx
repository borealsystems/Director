import React from 'react'
import { useQuery } from 'urql'
import { Loading } from 'carbon-components-react'
import Controller from './Controller.jsx'

import GraphQLError from '../components/GraphQLError.jsx'

import { controllerLayoutsQueryGQL, existingControllerQueryGQL } from './queries'

const ControllerWrapper = ({ match: { params: { id } } }) => {
  const [result] = useQuery({
    query: id === 'new' ? controllerLayoutsQueryGQL : existingControllerQueryGQL,
    variables: id === 'new' ? null : { id: id }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) { return <Loading /> }
  if (result.data) { return <Controller id={id} _controller={result.data.controller} layouts={result.data.controllerLayouts} panels={result.data.panels} /> }
}

export default ControllerWrapper
