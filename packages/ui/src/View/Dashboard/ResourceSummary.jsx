import React from 'react'
import { useQuery } from 'urql'
import { InlineLoading } from 'carbon-components-react'
import { Application20, Devices20, Document20, PanelExpansion20 } from '@carbon/icons-react'
import GraphQLError from '../components/GraphQLError.jsx'

const ResourceSummary = () => {
  const [result] = useQuery({
    query: `query resourceSummary($realm: String, $core: String) {
      devices(realm: $realm, core: $core) { id }
      stacks(realm: $realm, core: $core) { id }
      panels(realm: $realm, core: $core) { id }
      controllers(realm: $realm, core: $core) { id }
    }`,
    pollInterval: 10000
  })

  const offsetProp = { style: { transform: 'translate(0, 0.3em)' } }

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <InlineLoading />
  if (result.data) {
    return (
      <>
        <Devices20 { ...offsetProp }/> {result.data.devices.length} Device{result.data.devices.length !== 1 ? 's' : ''}<br/>
        <Document20 { ...offsetProp }/> {result.data.stacks.length} Stack{result.data.stacks.length !== 1 ? 's' : ''}<br/>
        <PanelExpansion20 { ...offsetProp }/> {result.data.panels.length} Panel{result.data.panels.length !== 1 ? 's' : ''}<br/>
        <Application20 { ...offsetProp }/> {result.data.controllers.length} Controller{result.data.controllers.length !== 1 ? 's' : ''}<br/>
      </>
    )
  }
}

export default ResourceSummary
