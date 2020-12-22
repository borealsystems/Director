import React from 'react'
import { useQuery } from 'urql'

import { InlineLoading, ToastNotification } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'

const Status = () => {
  const [result] = useQuery({
    query: '{ status }',
    pollInterval: 10000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <InlineLoading />
  if (result.data) {
    return (
      <>
        <h5>{result.data.status[1]}</h5>
        <br/>
        {result.data.status[2]}
      </>
      // <ToastNotification
      //   style={{ width: '100%', marginRight: 0 }}
      //   subtitle=''
      //   hideCloseButton={true}
      //   kind={result.data.status[0]}
      //   lowContrast
      //   notificationType='toast'
      //   role='alert'
      //   caption={result.data.status[2]}
      //   timeout={0}
      //   title={result.data.status[1]}
      // />
    )
  }
}

export default Status
