import React, { useState, useContext } from 'react'
import { useQuery } from 'urql'
import { useHistory } from 'react-router-dom'
import { ComboBox, Row, Column, Button, Grid, Loading, Tabs, Tab } from 'carbon-components-react'
import { Popup16 } from '@carbon/icons-react'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'
import ShotboxPanelWrapper from './ShotboxPanelWrapper.jsx'
import ShotboxControllerWrapper from './ShotboxControllerWrapper.jsx'

const Shotbox = () => {
  const { contextRealm } = useContext(globalContext)
  const [panel, setPanel] = useState({})
  const [controller, setController] = useState({})

  const [result] = useQuery({
    query: `query getShotboxData($realm: String, $core: String) {
      panels(realm: $realm, core: $core) {
        id
        label
        description
      }
      controllers(realm: $realm, core: $core) {
        id
        label
        description
      }
    }`,
    pollInterval: 1000,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const history = useHistory()

  const resetPanel = (panel) => {
    setPanel({})
    setTimeout(() => {
      setPanel(panel)
    }, 1)
  }

  const resetController = (controller) => {
    setController({})
    setTimeout(() => {
      setController(controller)
    }, 1)
  }

  return (
    <Grid>
      <Row>
        <Column>
          <h1>Shotbox</h1>
        </Column>
      </Row><br/>
      {result.error && <GraphQLError error={result.error} />}
      {result.fetching && <Loading/>}
      {result.data &&
        <Tabs>
          <Tab label='Panel'>
            <Row>
              <Column>
                <ComboBox
                  ariaLabel='Dropdown'
                  id='panel'
                  label='Select a panel'
                  placeholder='Type to Filter...'
                  items={result.data.panels}
                  selectedItem={panel}
                  itemToString={(item) => (item.id ? `${item.label} (${item.id})` : null)}
                  onChange={(selection) => { selection.selectedItem === null ? setPanel({}) : resetPanel(selection.selectedItem) }}
                  titleText='Panel'
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
                    <Button style={{ marginTop: '1.1em' }} renderIcon={Popup16} onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/control/shotbox/panel/${panel.id}` }) } } >
                      Open In New Tab
                    </Button>
                  </Column>
                </Row>
              </>
            }
          </Tab>
          <Tab label='Controller'>
            <Row>
              <Column>
                <ComboBox
                  ariaLabel='Dropdown'
                  id='controller'
                  label='Select a Controller'
                  placeholder='Type to Filter...'
                  items={result.data.controllers}
                  selectedItem={controller}
                  itemToString={(item) => (item.id ? `${item.label} (${item.id})` : null)}
                  onChange={(selection) => { selection.selectedItem === null ? setController({}) : resetController(selection.selectedItem) }}
                  titleText='Controller'
                />
              </Column>
            </Row>
            <br/>
            { controller.id &&
              <>
                <Row>
                  <Column>
                    <br/><br/>
                    <ShotboxControllerWrapper inline={true} match={{ params: { id: controller.id } }} />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Button style={{ marginTop: '1.1em' }} renderIcon={Popup16} onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/control/shotbox/controller/${controller.id}` }) } } >
                      Open In New Tab
                    </Button>
                  </Column>
                </Row>
              </>
            }
          </Tab>
        </Tabs>
      }
    </Grid>
  )
}

export default Shotbox
