import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Row, Column } from 'carbon-components-react'
import { useMutation } from 'urql'

const getEnabledProps = (button) => {
  if (button.stack) {
    return { kind: 'primary' }
  } else {
    return { disabled: true, kind: 'secondary' }
  }
}

const ShotboxPanel = ({ inline, panel }) => {
  const executeStackMutationGQL = `mutation executeStack($executeID: String) {
    executeStack(id: $executeID)
  }`

  // eslint-disable-next-line no-unused-vars
  var [executeStackMutationResult, executeStackMutation] = useMutation(executeStackMutationGQL)
  return (
    <Grid style={{ width: '100%' }} condensed>
      { !inline &&
        <Row>
          <Column>
            <h1>{panel.label}</h1>
            <br/><br/>
          </Column>
        </Row>
      }
      { panel.buttons !== undefined && panel.buttons.map((row, rowIndex) => {
        return (
          <Row key={rowIndex}>
            { row.map((button, buttonIndex) => (
              <Column key={buttonIndex}>
                <Button onClick={() => {
                  executeStackMutation({ executeID: button.stack.id })
                }} style={{ minWidth: '10px', maxWidth: '50em', padding: '10px', width: '100%', height: '6em', display: 'table' }} size='default' { ...getEnabledProps(button) }>
                  <>
                    <h5>{button.stack?.id ? button.stack.panelLabel ? button.stack.panelLabel : button.stack.label : ' '}</h5>
                    {button.stack?.id ? button.stack.panelLabel ? button.stack.label : ' ' : ' '}<br/>
                    {button.stack?.id ? `ID: ${button.stack.id}` : ' '}
                  </>
                </Button>
              </Column>
            ))
            }
          </Row>
        )
      })}
      <br/>
    </Grid>
  )
}

ShotboxPanel.propTypes = {
  panel: PropTypes.object,
  inline: PropTypes.bool
}

export default ShotboxPanel
