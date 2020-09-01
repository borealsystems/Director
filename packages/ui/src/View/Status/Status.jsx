import React from 'react'
import { useQuery } from 'urql'

import { InlineLoading, ToastNotification } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'

const Status = () => {
  const [result] = useQuery({
    query: '{ status }',
    pollInterval: 1000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
        System Status
        </h1>
        <InlineLoading />
      </div>
    )
  }
  if (result.data) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          System Status
        </h1>
        <ToastNotification
          subtitle=""
          hideCloseButton={true}
          kind={result.data.status[0]}
          lowContrast
          notificationType="toast"
          role="alert"
          style={{
            paddingRight: '5rem',
            minWidth: '35rem'
          }}
          caption={result.data.status[2]}
          timeout={0}
          title={result.data.status[1]}
        />
      </div>
    )
  }
}

export default Status
