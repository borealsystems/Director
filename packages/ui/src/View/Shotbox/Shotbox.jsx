import React, { useState } from 'react'
import { useQuery } from 'urql'
import { ComboBox, Row, Column, DropdownSkeleton, InlineNotification } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'
import ShotboxPanelWrapper from './ShotboxPanelWrapper.jsx'

const Shotbox = () => {
  var [panel, setPanel] = useState({})

  const [result] = useQuery({
    query: `query getShotboxData {
      panels {
        id
        label
        description
      }
    }`,
    pollInterval: 1000
  })

  const resetPanel = (panel) => {
    setPanel({})
    setTimeout(() => {
      setPanel(panel)
    }, 1)
  }

  if (result.error) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Shotbox
        </h1>
        <GraphQLError error={result.error} />
      </div>
    )
  }
  if (result.fetching) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
            Shotbox
        </h1>
        <DropdownSkeleton />
      </div>
    )
  }
  if (result.data) {
    return (
      <div>
        <InlineNotification
          style={{ width: '100%' }}
          lowContrast={true}
          kind='warning'
          title='This interface is being overhauled'
          subtitle='Items may move and/or break in the near future, please report bugs to Phabricator T96'
          hideCloseButton={true}
        />
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Shotbox
        </h1>
        <Row>
          <Column>
            <ComboBox
              ariaLabel="Dropdown"
              id="panel"
              label='Select a panel'
              placeholder='Filter...'
              items={result.data.panels}
              itemToString={(item) => (`${item.label} (${item.id})`)}
              onChange={(selection) => { selection.selectedItem === null ? setPanel({}) : resetPanel(selection.selectedItem) }}
              titleText="Panel (required)"
            />
          </Column>
        </Row>
        <br/>
        { panel.id &&
          <Row>
            <Column>
              <br/><br/>
              <ShotboxPanelWrapper inline={true} match={{ params: { id: panel.id } }} />
            </Column>
          </Row>
        }
      </div>
    )
  }
}

export default Shotbox
