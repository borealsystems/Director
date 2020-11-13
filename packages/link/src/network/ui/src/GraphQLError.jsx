import React from 'react'
import PropTypes from 'prop-types'
import { ToastNotification } from 'carbon-components-react'

const GraphQLError = (props) => {
  if (props.error.networkError) {
    return (
      <ToastNotification
        hideCloseButton={true}
        kind="error"
        lowContrast
        notificationType="toast"
        role="alert"
        style={{
          marginBottom: '.5rem',
          minWidth: '30rem'
        }}
        caption={props.error.message}
        subtitle="The UI cannot communicate with DirectorLink, please make sure you are connected to the network."
        timeout={0}
        title="Network Error"
      />
    )
  } else if (props.error.graphQLErrors.length > 0) {
    return (
      <ToastNotification
        hideCloseButton={true}
        kind="error"
        lowContrast
        notificationType="toast"
        role="alert"
        style={{
          marginBottom: '.5rem',
          minWidth: '30rem'
        }}
        caption={JSON.stringify(props.error.graphQLErrors)}
        subtitle="DirectorLink experienced an error, please contact your system administrator with the error below."
        timeout={0}
        title="GraphQL Error"
      />
    )
  }
}

GraphQLError.propTypes = {
  error: PropTypes.any
}

export default GraphQLError
