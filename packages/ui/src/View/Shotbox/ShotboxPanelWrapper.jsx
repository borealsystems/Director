import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { useQuery } from 'urql'
import ShotboxPanel from './ShotboxPanel.jsx'
import GraphQLError from '../components/GraphQLError.jsx'
import { panelQueryGQL } from './queries'

const ShotboxPanelWrapper = ({ inline, match: { params: { id } }, controller }) => {
  const [panel, setPanel] = useState({})
  const [result] = useQuery({
    query: panelQueryGQL,
    variables: { id: id },
    pause: controller?.panel?.buttons ?? !id
  })

  if (result.error) { return <GraphQLError error={result.error} /> }
  if (result.fetching) { return <Loading /> }
  if (result.data && !panel.id) {
    const buttons = []
    result.data.panel.buttons.map(row => { buttons.push(Object.keys(row).map(function (key) { return row[key] })) })
    setPanel({ ...result.data.panel, buttons: buttons })
    return <Loading />
  }
  if (controller?.panel?.buttons) {
    return <ShotboxPanel inline={inline} panel={controller.panel} controller={controller} />
  }
  if (!controller?.panel?.buttons && panel.id) {
    return <ShotboxPanel inline={inline} panel={panel} controller={controller} />
  }
}

ShotboxPanelWrapper.propTypes = {
  match: PropTypes.object,
  inline: PropTypes.bool,
  controller: PropTypes.object
}

export default ShotboxPanelWrapper
