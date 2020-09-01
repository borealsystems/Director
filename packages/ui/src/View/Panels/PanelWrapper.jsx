import React from 'react'
import { useQuery } from 'urql'
import { Loading } from 'carbon-components-react'
import Panel from './Panel.jsx'

import GraphQLError from '../components/GraphQLError.jsx'

import { existingPanelGQL, newPanelGQL } from './queries'

const PanelWrapper = ({ match: { params: { id } } }) => {
  const [result] = useQuery({
    query: id === 'new' ? newPanelGQL : existingPanelGQL,
    variables: id === 'new' ? null : { id: id }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) { return <Loading /> }
  if (result.data) { return <Panel id={id} result={result} /> }
}

export default PanelWrapper
