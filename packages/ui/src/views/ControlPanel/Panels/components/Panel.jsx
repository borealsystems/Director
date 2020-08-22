import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'
import { Grid, Row, Column, ComboBox, Button, TextInput } from 'carbon-components-react'
import { useMutation } from 'urql'

function matrix (rows, cols, defaultValue) {
  var arr = []
  for (var i = 0; i < rows; i++) {
    arr.push([])
    arr[i].push(new Array(cols))
    for (var j = 0; j < cols; j++) {
      arr[i][j] = { row: i, column: j }
    }
  }
  return arr
}

const deletePanelGQL = `
  mutation deletePanel($deleteID: String) {
    deletePanel(id: $deleteID)
  }
`

const panelUpdateMutationGQL = `
  mutation updatePanel($panel: panelUpdateInputType) {
    updatePanel(panel: $panel) {
      id
    }
  }
`

const Panel = (props) => {
  let initialPanel = {}
  if (props.new) {
    initialPanel = {}
  } else {
    const thisPanel = props.new ? null : { ...props.panels.find(panel => panel.id === props.panelID) }
    const buttons = []
    if (thisPanel.buttons) thisPanel.buttons.map(row => { buttons.push(Object.keys(row).map((key) => { return row[key] })) })
    initialPanel = { ...thisPanel, buttons: buttons }
  }
  var [panel, setPanel] = useState(initialPanel)

  const [deletePanelMutationResult, deletePanelMutation] = useMutation(deletePanelGQL)
  const [panelUpdateMutationResult, panelUpdateMutation] = useMutation(panelUpdateMutationGQL)

  const updatePanel = () => {
    const stackUpdateObject = { panel: omit(panel, 'currentButton') }
    console.log(JSON.stringify(stackUpdateObject))
    panelUpdateMutation(stackUpdateObject).then(console.log(panelUpdateMutationResult))
    if (props.visability) {
      props.visability(false)
    }
  }

  const getButtonColour = (button) => {
    if (button.row === panel.currentButton?.row) {
      if (button.column === panel.currentButton?.column) {
        return 'primary'
      } else {
        return 'secondary'
      }
    } else {
      return 'secondary'
    }
  }

  return (
    <div className="bx--col-lg-10">
      <div className="bx--grid">
        { props.new &&
          <div className="bx--row">
            <h3 style={{
              margin: '1vh 0 2vh 1vw'
            }}> New Panel</h3>
          </div>
        }
        { !props.new &&
          <div className="bx--row">
            <h3 style={{
              margin: '1vh 0 2vh 1vw'
            }}> {panel.label}</h3>
          </div>
        }
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='panelName'
              placeholder='Required'
              value={panel.label}
              labelText='Panel Label'
              onClick={() => {}}
              onChange={(e) => { setPanel({ ...panel, label: e.target.value }) }}
            />
          </div>
        </div><br/>
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='panelDescription'
              placeholder='Optional'
              value={panel.description || undefined}
              labelText='Panel Description'
              onClick={() => {}}
              onChange={(e) => { setPanel({ ...panel, description: e.target.value }) }}
            />
          </div>
        </div><br/>
        { props.new &&
          <div className="bx--row">
            <div className="bx--col">
              <ComboBox
                ariaLabel="Dropdown"
                id="panelLayoutType"
                placeholder='Filter...'
                selectedItem={panel.layoutType}
                items={[{ id: 'controller', label: 'Controller Layout' }, { id: 'custom', label: 'Custom' }]}
                onChange={(layout) => { setPanel({ ...panel, layoutType: layout.selectedItem, layout: {} }) }}
                titleText="Panel Type"
              />
            </div>
            { !panel.layoutType &&
              <div className="bx--col">
                <ComboBox
                  disabled
                  ariaLabel="Dropdown"
                  id="panelLayout"
                  placeholder='Filter...'
                  items={[]}
                  onChange={() => {}}
                  titleText="Panel Layout"
                />
              </div>
            }
            { panel.layoutType && panel.layoutType.id === 'controller' &&
              <div className="bx--col">
                <ComboBox
                  ariaLabel="Dropdown"
                  id="panelLayout"
                  placeholder='Filter...'
                  selectedItem={panel.layout}
                  items={
                    [
                      { id: 'elgato-streamdeck-mini', label: 'Elgato Streamdeck Mini', rows: 2, columns: 3 },
                      { id: 'elgato-streamdeck', label: 'Elgato Streamdeck', rows: 3, columns: 5 },
                      { id: 'elgato-streamdeck-XL', label: 'Elgato Streamdeck XL', rows: 4, columns: 8 }
                    ]
                  }
                  onChange={(layout) => { setPanel({ ...panel, layout: layout.selectedItem }) }}
                  titleText="Panel Layout"
                />
              </div>
            }
            { panel.layoutType && panel.layoutType.id === 'custom' &&
              <>
                <div className="bx--text-input__field-wrapper bx--col">
                  <TextInput
                    type='text'
                    id='panelLayoutCustomY'
                    placeholder=''
                    value={panel.layout.rows || undefined}
                    labelText='Rows'
                    onClick={() => {}}
                    onChange={(e) => { setPanel({ ...panel, layout: { ...panel.layout, id: 'custom', rows: e.target.value } }) }}
                  />
                </div>
                <div className="bx--text-input__field-wrapper bx--col">
                  <TextInput
                    type='text'
                    id='panelLayoutCustomX'
                    placeholder=''
                    value={panel.layout.columns || undefined}
                    labelText='Columns'
                    onClick={() => {}}
                    onChange={(e) => { setPanel({ ...panel, layout: { ...panel.layout, id: 'custom', columns: e.target.value } }) }}
                  />
                </div>
              </>
            }
            { panel.layout && panel.layout.rows && panel.layout.columns &&
              <div className="bx--col">
                <Button onClick={() => { setPanel({ ...panel, buttons: matrix(panel.layout.rows, panel.layout.columns, { }) }) }} size='small' style={{ marginTop: '24px', height: '40px' }} kind="secondary">
                  Generate Matrix
                </Button>
              </div>
            }
            { !panel.layout?.columns &&
              <div className="bx--col">
                <Button disabled onClick={() => { }} size='small' style={{ marginTop: '24px', height: '40px' }} kind="secondary">
                  Generate Matrix
                </Button>
              </div>
            }
          </div>
        }
        { !props.new &&
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                disabled
                type='text'
                id='panelLayoutType'
                placeholder=''
                value={panel.layoutType.label}
                labelText='Panel Layout Type'
                onClick={() => {}}
                onChange={(e) => { }}
              />
            </div>
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                disabled
                type='text'
                id='panelLayout'
                placeholder=''
                value={panel.layout.label}
                labelText='Panel Layout'
                onClick={() => {}}
                onChange={(e) => { }}
              />
            </div>
          </div>
        }
        <br/>
        { panel.buttons && <><h3>Panel Buttons</h3><br/></> }
        <Grid style={{ paddingRight: '0', paddingLeft: '1em', width: '102%' }} condensed>
          { panel.buttons && panel.buttons.map((row, rowIndex) => {
            return (
              <React.Fragment key={rowIndex}>
                <Row className="bx--text-input__field-wrapper">
                  { row.map((button, buttonIndex) => {
                    return (
                      <Column className="bx--button__field-wrapper" key={buttonIndex}>
                        <Button onClick={() => { setPanel({ ...panel, currentButton: button }) }} style={{ minWidth: '10px', padding: '10px', width: '100%', height: '8em', display: 'table' }} size='default' kind={getButtonColour(button)}>
                          <>
                            <h5>{button.stack?.id ? button.stack.panelLabel : ''}</h5>
                            {button.stack?.id ? button.stack.label : ''}<br/>
                            {button.stack?.id ? button.stack.id : ''}
                            {/* <br/><sub>{button.row},{button.column}</sub> */}
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
        { panel.currentButton &&
          <>
            <h4>Button Configuration for {panel.currentButton.row},{panel.currentButton.column}:</h4>
            <br/>
            <div className="bx--row">
              <div className="bx--col">
                <ComboBox
                  ariaLabel="Dropdown"
                  id="buttonStackSelection"
                  placeholder='Filter...'
                  selectedItem={panel.currentButton.stack}
                  items={props.stacks}
                  itemToString={(item) => (item ? `${item.label}  |  ${item.panelLabel}` : null)}
                  onChange={(stack) => {
                    const panelIntermediate = { ...panel }
                    panelIntermediate.buttons[panel.currentButton.row][panel.currentButton.column].stack = stack.selectedItem
                    setPanel(panelIntermediate)
                  }}
                  titleText="Stack"
                />
              </div>
              <div className="bx--col">
                { panel.currentButton?.stack &&
                  <Button onClick={(stack) => {
                    const panelIntermediate = { ...panel }
                    panelIntermediate.buttons[panel.currentButton.row][panel.currentButton.column].stack = null
                    setPanel(panelIntermediate)
                  }} size='small' style={{ marginTop: '25px', height: '40px' }} kind="danger">
                    Clear Button
                  </Button>
                }
                { !panel.currentButton?.stack &&
                  <Button disabled onClick={() => {}} size='small' style={{ marginTop: '25px', height: '40px' }} kind="danger">
                    Clear Button
                  </Button>
                }
              </div>
            </div>
            <br/><br/>
          </>
        }
        { panel.layout === null && panel.label === null
          ? <Button disabled onClick={() => { }} size='default' kind="primary">
            { !props.new && <>Update</> }
            { props.new && <>Create</> }
          </Button>
          : <Button onClick={() => { updatePanel() }} size='default' kind="primary">
            { !props.new && <>Update</> }
            { props.new && <>Create</> }
          </Button>
        }
        { !props.new &&
            <Button onClick={() => deletePanelMutation({ deleteID: panel.id }).then(console.log(deletePanelMutationResult))} size='default' kind="danger">
              Delete
            </Button>
        }
        <Button onClick={() => { props.visability(false) }} size='default' kind="secondary">
              Cancel
        </Button>
        <br/><br/>
      </div>
    </div>
  )
}

Panel.propTypes = {
  new: PropTypes.bool,
  panelID: PropTypes.string,
  panels: PropTypes.array,
  buttons: PropTypes.array,
  stacks: PropTypes.array,
  visability: PropTypes.func
}

export default Panel
