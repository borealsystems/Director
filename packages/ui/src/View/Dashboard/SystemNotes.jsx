import React from 'react'
import { useQuery } from 'urql'
import Markdown from 'react-markdown'

import { InlineLoading } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'

const SystemNotes = () => {
  const [result] = useQuery({
    query: `query systemNotes {
      cores {
        id
        systemNotes
      }
      thisCore {
        id
      }
    }`,
    pollInterval: 10000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <InlineLoading />
  if (result.data) {
    return (
      <>
        <Markdown
          escapeHtml={true}
          source={result.data.cores.find(core => core.id === result.data.thisCore.id).systemNotes}
        />
      </>
    )
  }
}

export default SystemNotes
