import React from 'react'
import { useQuery } from 'urql'
import { Loading, ToastNotification } from 'carbon-components-react'

const Status = () => {
  const [result] = useQuery({
    query: '{ getStatus }',
    pollInterval: 1000
  })

  if (result.error) {
    return (
      <ToastNotification
        caption={result.error}
        hideCloseButton={true}
        kind="error"
        lowContrast
        notificationType="toast"
        role="alert"
        style={{
          marginBottom: '.5rem',
          minWidth: '30rem'
        }}
        subtitle="The Director UI cannot communicate with the server. Please check your network connection then contact your system administrator."
        timeout={0}
        title="Communication Error"
      />
    )
  }
  if (result.fetching) return <Loading />
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
          caption=""
          hideCloseButton={true}
          kind={result.data.getStatus[0]}
          lowContrast
          notificationType="toast"
          role="alert"
          style={{
            paddingRight: '5rem',
            minWidth: '35rem'
          }}
          subtitle={result.data.getStatus[2]}
          timeout={0}
          title={result.data.getStatus[1]}
        />
      </div>
    )
  }
}

export default Status
