import React from 'react'
import PropTypes from 'prop-types'
import { ToastNotification } from 'carbon-components-react'

const GraphQLError = (props) => {
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
      subtitle={props.error}
      caption="The Director UI cannot communicate with the server or the server encountered an error. Please check your network connection then contact your system administrator."
      timeout={0}
      title="GraphQL Error"
    />
  )
}

GraphQLError.propTypes = {
  error: PropTypes.any
}

export default GraphQLError
