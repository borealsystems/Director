import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Dropdown, Button, Grid, Row, Column, Loading } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'

const Shotbox = () => {
  var [panel, setPanel] = useState({})

  const selectPanel = (panel) => {
    const buttons = []
    panel.buttons.map(row => { buttons.push(Object.keys(row).map(function (key) { return row[key] })) })
    setPanel({ ...panel, buttons: buttons })
  }

  const getEnabledProps = (button) => {
    if (button.stack) {
      return { kind: 'primary' }
    } else {
      return { disabled: true, kind: 'secondary' }
    }
  }

  const [result] = useQuery({
    query: `query getShotboxData {
      getPanels {
        id
        label
        description
        layout {
          id
          label
        }
        buttons {
          row
          column
          stack {
            id
            label
            description
          }
        }
      }
    }`,
    pollInterval: 1000
  })

  const executeStackMutationGQL = `mutation executeStack($executeID: String) {
    executeStack(id: $executeID)
  }`

  // eslint-disable-next-line no-unused-vars
  var [executeStackMutationResult, executeStackMutation] = useMutation(executeStackMutationGQL)

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
        <GraphQLError error={result.error.message} />
      </div>
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
          Shotbox
        </h1>
        <div className="bx--row">
          <div className="bx--col">
            <Dropdown
              ariaLabel="Dropdown"
              id="panel"
              label='Select a panel'
              items={result.data.getPanels}
              onChange={(selection) => { selectPanel(selection.selectedItem) }}
              titleText="Panel"
            />
          </div>
        </div>
        <br/>
        { panel &&
          <div className="bx--row">
            <Grid style={{ width: '100%' }} condensed>
              { panel.buttons && panel.buttons.map((row, rowIndex) => {
                return (
                  <React.Fragment key={rowIndex}>
                    <Row>
                      { row.map((button, buttonIndex) => {
                        return (
                          <Column key={buttonIndex}>
                            <Button onClick={() => {
                              executeStackMutation({ executeID: button.stack.id })
                            }} style={{ minWidth: '10px', maxWidth: '50em', padding: '10px', width: '100%', height: '6em', display: 'table' }} size='default' { ...getEnabledProps(button) }>
                              <>
                                <h5>{button.stack?.id ? button.stack.label : ''}</h5>
                                {button.stack?.id ? button.stack.id : ''}
                                <br/><sub>{button.row},{button.column}</sub>
                              </>
                            </Button>
                          </Column>
                        )
                      })
                      }
                    </Row>
                  </React.Fragment>
                )
              })}
              <br/>
            </Grid>
          </div>
        }
      </div>
    )
  }
}

export default Shotbox
