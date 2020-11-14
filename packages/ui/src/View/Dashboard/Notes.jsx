import React, { useContext } from 'react'
import { useQuery } from 'urql'
import Markdown from 'react-markdown'
import globalContext from '../../globalContext'

import { InlineLoading } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'

const Notes = () => {
  const { contextRealm } = useContext(globalContext)
  const [result] = useQuery({
    query: `query realm($realm: String, $core: String) {
      realm(realm: $realm, core:$core) {
        notes
      }
    }`,
    pollInterval: 10000,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) {
    return (
      <>
        <h5>{contextRealm.coreLabel} {contextRealm.id === 'ROOT' ? 'root' : `/ ${contextRealm.label}` }</h5><br/>
        <InlineLoading />
      </>
    )
  }
  if (result.data) {
    return (
      <>
        <h5>{contextRealm.coreLabel} {contextRealm.id === 'ROOT' ? 'root' : `/ ${contextRealm.label}` }</h5><br/>
        <Markdown
          escapeHtml={true}
          source={result.data.realm.notes}
        />
      </>
    )
  }
}

export default Notes
