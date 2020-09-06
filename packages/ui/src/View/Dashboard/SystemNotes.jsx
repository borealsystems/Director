import React from 'react'
import { useQuery } from 'urql'
import Markdown from 'react-markdown'

import { InlineLoading } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'

const SystemNotes = () => {
  const [result] = useQuery({
    query: `query systemNotes {
      coreConfig {
        systemNotes
      }
    }`,
    pollInterval: 10000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <InlineLoading />
  if (result.data) {
    return (
      <>
        <p style={{ fontSize: '.875rem' }}>
          <Markdown
            escapeHtml={true}
            source={result.data.coreConfig.systemNotes}
          />
        </p>
      </>
    )
  }
}

export default SystemNotes
