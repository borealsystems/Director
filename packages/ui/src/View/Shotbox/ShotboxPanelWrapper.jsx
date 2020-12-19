import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { useQuery } from 'urql'
import ShotboxPanel from './ShotboxPanel.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const ShotboxPanelWrapper = ({ inline, match: { params: { id } } }) => {
  const [panel, setPanel] = useState({})
  const [result] = useQuery({
    query: `query panelData($id: String) {
      panel(id: $id) {
        id
        label
        buttons {
          row
          column
          stack {
            id
            label
            panelLabel
            description
          }
        }
      }
    }`,
    variables: { id: id },
    pause: !id
  })

  if (result.error) { return <GraphQLError error={result.error} /> }
  if (result.fetching) { return <Loading /> }
  if (result.data && !panel.id) {
    const buttons = []
    result.data.panel.buttons.map(row => { buttons.push(Object.keys(row).map(function (key) { return row[key] })) })
    setPanel({ ...result.data.panel, buttons: buttons })
    return <Loading />
  }
  if (panel.id) {
    return <ShotboxPanel inline={inline} panel={panel} />
  }
}

ShotboxPanelWrapper.propTypes = {
  match: PropTypes.object,
  inline: PropTypes.bool
}

export default ShotboxPanelWrapper
