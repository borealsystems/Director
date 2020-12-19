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

  var [, executeStackMutation] = useMutation(executeStackMutationGQL)
  return (
    <Grid style={{ width: '100%', margin: 0, padding: 0 }} condensed>
      { !inline &&
        <Row style={{ marginLeft: '0.1em' }}>
          <Column>
            <h1>{panel.label}</h1>
            <br/><br/>
          </Column>
        </Row>
      }
      <div style={{ overflow: 'auto' }}>
        { panel.buttons !== undefined && panel.buttons.map((row, rowIndex) => {
          return (
            <Row key={rowIndex} style={{ flexWrap: 'nowrap', margin: 0, padding: 0 }}>
              { row.map((button, buttonIndex) => (
                <Column key={buttonIndex} style={{ minWidth: `${88 / row.length}em` }}>
                  <Button
                    onClick={() => {
                      executeStackMutation({ executeID: button.stack.id })
                    }}
                    style={{ width: '100%', maxWidth: '100%', height: '6em' }}
                    size='default'
                    { ...getEnabledProps(button) }
                  >
                    <>
                      <h5>{button.stack?.id ? button.stack.panelLabel ? button.stack.panelLabel : button.stack.label : ' '}</h5>
                    </>
                  </Button>
                </Column>
              ))
              }
            </Row>
          )
        })}
      </div>
      <br/>
    </Grid>
  )
}

ShotboxPanel.propTypes = {
  panel: PropTypes.object,
  inline: PropTypes.bool
}

export default ShotboxPanel
