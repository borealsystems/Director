import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
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
    console.log(response)
    if (response.controller.id === controller.id) {
      console.log('this controller')
      refresh()
      setController({ ...response })
    }
    return [response.newMessages, ...messages]
  })

  if (result.error) { return <GraphQLError error={result.error} /> }
  if (result.fetching && !controller.id) { return <Loading /> }
  if (result.data && !controller.id) {
    console.log('setting to data')
    setController({ ...result.data.controller })
    return (<></>)
  }
  if (controller.panel.id) {
    console.log(controller.panel.id)
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
}

ShotboxControllerWrapper.propTypes = {
  match: PropTypes.object,
  inline: PropTypes.bool
}

export default ShotboxControllerWrapper
