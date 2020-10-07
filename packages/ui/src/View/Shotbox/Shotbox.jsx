import React, { useState, useContext } from 'react'
import { useQuery } from 'urql'
import { ComboBox, Row, Column, DropdownSkeleton, Button } from 'carbon-components-react'
import { Popup16 } from '@carbon/icons-react'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'
import ShotboxPanelWrapper from './ShotboxPanelWrapper.jsx'

const Shotbox = () => {
  const { contextRealm } = useContext(globalContext)
  const [panel, setPanel] = useState({})

  const [result] = useQuery({
    query: `query getShotboxData($realm: String, $core: String) {
      panels(realm: $realm, core: $core) {
        id
        label
        description
      }
    }`,
    pollInterval: 1000,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
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
              placeholder='Type to Filter...'
              items={result.data.panels}
              selectedItem={panel}
              itemToString={(item) => (item.id ? `${item.label} (${item.id})` : null)}
              onChange={(selection) => { selection.selectedItem === null ? setPanel({}) : resetPanel(selection.selectedItem) }}
              titleText="Panel"
            />
          </Column>
        </Row>
        <br/>
        { panel.id &&
          <>
            <Row>
              <Column>
                <br/><br/>
                <ShotboxPanelWrapper inline={true} match={{ params: { id: panel.id } }} />
              </Column>
            </Row>
            <Row>
              <Column>
                <Button style={{ marginTop: '1.1em' }} renderIcon={Popup16} onClick={() => { window.open(`${window.location.href}/${panel.id}`) } } >
                  Open In New Tab
                </Button>
              </Column>
            </Row>
          </>
        }
      </div>
    )
  }
}

export default Shotbox
