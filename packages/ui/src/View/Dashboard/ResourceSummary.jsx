import React, { useContext } from 'react'
import { useQuery } from 'urql'
import { InlineLoading } from 'carbon-components-react'
import { DataBase16, FolderDetails16, Application16, ResearchHintonPlot16 } from '@carbon/icons-react'
import GraphQLError from '../components/GraphQLError.jsx'
import globalContext from '../../globalContext'

const ResourceSummary = () => {
  const { contextRealm } = useContext(globalContext)
  const [result] = useQuery({
    query: `query resourceSummary($realm: String, $core: String) {
      devices(realm: $realm, core: $core) { id }
      stacks(realm: $realm, core: $core) { id }
      panels(realm: $realm, core: $core) { id }
      controllers(realm: $realm, core: $core) { id }
    }`,
    variables: { realm: contextRealm.id, core: contextRealm.coreID },
    pollInterval: 10000
  })

  const offsetProp = { style: { transform: 'translate(0, 0.3em)' } }

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <InlineLoading />
  if (result.data) {
    return (
      <>
        <DataBase16 { ...offsetProp }/> {result.data.devices.length} Device{result.data.devices.length !== 1 ? 's' : ''}<br/>
        <FolderDetails16 { ...offsetProp }/> {result.data.stacks.length} Stack{result.data.stacks.length !== 1 ? 's' : ''}<br/>
        <Application16 { ...offsetProp }/> {result.data.panels.length} Panel{result.data.panels.length !== 1 ? 's' : ''}<br/>
        <ResearchHintonPlot16 { ...offsetProp }/> {result.data.controllers.length} Controller{result.data.controllers.length !== 1 ? 's' : ''}<br/>
      </>
    )
  }
}

export default ResourceSummary
