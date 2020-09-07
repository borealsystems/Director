import React from 'react'
import { useQuery } from 'urql'

import { InlineLoading } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'
import { Application20, Devices20, Document20, PanelExpansion20, DataConnected20 } from '@carbon/icons-react'

const ResourceSummary = () => {
  const [result] = useQuery({
    query: `query resourceSummary {
      devices { id }
      stacks { id }
      panels { id }
      controllers { id }
      getBridges { address }
    }`,
    pollInterval: 10000
  })

  const offsetProp = { style: { transform: 'translate(0, 0.3em)' } }

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <InlineLoading />
  if (result.data) {
    return (
      <>
        <br/><p>This core has the following configured artifacts:</p>
        <Devices20 { ...offsetProp }/> {result.data.devices.length} Device{result.data.devices.length !== 1 ? 's' : ''}<br/>
        <Document20 { ...offsetProp }/> {result.data.stacks.length} Stack{result.data.stacks.length !== 1 ? 's' : ''}<br/>
        <PanelExpansion20 { ...offsetProp }/> {result.data.panels.length} Panel{result.data.panels.length !== 1 ? 's' : ''}<br/>
        <Application20 { ...offsetProp }/> {result.data.controllers.length} Controller{result.data.controllers.length !== 1 ? 's' : ''}<br/>
        <DataConnected20 { ...offsetProp }/> {result.data.getBridges.length} Bridge{result.data.getBridges.length !== 1 ? 's' : ''}
      </>
    )
  }
}

export default ResourceSummary
