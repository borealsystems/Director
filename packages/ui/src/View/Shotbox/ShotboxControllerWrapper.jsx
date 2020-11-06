import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Loading, ToastNotification } from 'carbon-components-react'
import { useQuery, useSubscription } from 'urql'
import { controllerSubscriptionGQL } from './queries'
import ShotboxPanelWrapper from './ShotboxPanelWrapper.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const ShotboxControllerWrapper = ({ inline, match: { params: { id } } }) => {
  const [controller, setController] = useState({})
  const [result, refresh] = useQuery({
    query: `query controller($id: String) {
      controller(id: $id) {
        id
        label
        layout {
          id
          label
          rows
          columns
        }
        panel {
          id
          label
        }
      }
    }`,
    variables: { id: id },
    pause: !id,
    requestPolicy: 'network-only'
  })

  // eslint-disable-next-line no-unused-vars
  const [controllerUpdateSubscription] = useSubscription({ query: controllerSubscriptionGQL }, (messages = [], response) => {
    if (response.controller.id === controller.id) {
      refresh()
      setController({ ...response })
    }
    return [response.newMessages, ...messages]
  })

  if (result.error) { return <GraphQLError error={result.error} /> }
  if (result.fetching && !controller.id) { return <Loading /> }
  if (result.data && !controller.id) {
    setController({ ...result.data.controller })
    return (<></>)
  }
  if (controller.panel?.id) {
    return (
      <>
        { !inline &&
          <>
            <strong style={{ marginLeft: '2em' }}>Virtual Controller: {controller.label}</strong>
            <br/><br/>
          </>
        }
        <ShotboxPanelWrapper inline={inline} match={{ params: { id: controller.panel.id } }} />
      </>
    )
  }
  if (controller.id && !controller.panel?.id) {
    return (
      <ToastNotification
        hideCloseButton={true}
        kind="warning"
        lowContrast
        notificationType="toast"
        role="alert"
        style={{
          marginBottom: '.5rem',
          minWidth: '30rem'
        }}
        caption='Please contact your system administrator if this is unexpected'
        timeout={0}
        title='There is no panel Mapped to this Controller'
      />
    )
  }
}

ShotboxControllerWrapper.propTypes = {
  match: PropTypes.object,
  inline: PropTypes.bool
}

export default ShotboxControllerWrapper
