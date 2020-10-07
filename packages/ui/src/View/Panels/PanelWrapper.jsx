import React, { useContext } from 'react'
import { useQuery } from 'urql'
import { Loading } from 'carbon-components-react'
import { existingPanelGQL, newPanelGQL } from './queries'
import globalContext from '../../globalContext'
import Panel from './Panel.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const PanelWrapper = ({ match: { params: { id } } }) => {
  const { contextRealm } = useContext(globalContext)
  const [result] = useQuery({
    query: id === 'new' ? newPanelGQL : existingPanelGQL,
    variables: id === 'new' ? { core: contextRealm.coreID, realm: contextRealm.id } : { id: id, core: contextRealm.coreID, realm: contextRealm.id }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) { return <Loading /> }
  if (result.data) { return <Panel id={id} result={result} /> }
}

export default PanelWrapper
