import React, { useState } from 'react'
import { Button, ButtonSet, ComboBox, TextInput, Form, FormGroup, ProgressIndicator, ProgressStep, Grid, Row, Column, InlineNotification, Loading } from 'carbon-components-react'
import { ArrowRight24, Exit24, ArrowLeft24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'
import { omit } from 'lodash'
import { useMutation } from 'urql'
import { panelUpdateMutationGQL } from './queries'

const Panel = ({ id, result }) => {
  const isNew = id === 'new'
  const history = useHistory()

  let initialPanel = {}
  if (isNew) {
    initialPanel = {}
  } else {
    const thisPanel = isNew ? null : { ...result.data.panel }
    const buttons = []
    if (thisPanel.buttons) thisPanel.buttons.map(row => { buttons.push(Object.keys(row).map((key) => { return row[key] })) })
    initialPanel = { ...thisPanel, buttons: buttons }
  }
  var [panel, setPanel] = useState(initialPanel)
  console.log(panel)

  const [configurationStep, setConfigurationStep] = useState(isNew ? 0 : 1)
  const [errors, setErrors] = useState({
    layoutType: ''
  })

  // const [deletePanelMutationResult, deletePanelMutation] = useMutation(deletePanelGQL)
  const [panelUpdateMutationResult, panelUpdateMutation] = useMutation(panelUpdateMutationGQL)

  const updatePanel = () => {
    const stackUpdateObject = { panel: omit(panel, 'currentButton') }
    console.log(JSON.stringify(stackUpdateObject))
    panelUpdateMutation(stackUpdateObject).then(console.log(panelUpdateMutationResult))
    history.push({ pathname: '/config/panels' })
  }

  const formOnChange = (field, value) => {
    const scopedErrors = { ...errors }

    console.log(field, value)
    switch (field) {
      case 'layoutType':
        scopedErrors.layoutType = !value ? 'Please select a panel layout type' : ''
    }

    setErrors(scopedErrors)
    setPanel({ ...panel, [field]: value })
  }

  const matrix = (rows, cols, defaultValue) => {
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

  const buildMatrix = () => {
    setPanel({ ...panel, buttons: matrix(panel.layout.rows, panel.layout.columns, { }) })
    setConfigurationStep(configurationStep + 1)
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

  if (result.fetching) { return <Loading /> }
  if (result.data) {
    return (
      <Form>
        <Grid>
          <Row>
            <Column>
              <InlineNotification
                style={{ width: '100%' }}
                lowContrast={true}
                kind='warning'
                title='Unfinished Interface'
                subtitle='This page does not have input validation yet'
                hideCloseButton={true}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <h1>{ id === 'new' ? 'New Panel' : { ...panel }.label || ' ' }</h1><br/>
            </Column>
          </Row>
          <Row>
            <Column>
              <ProgressIndicator
                vertical={false}
                currentIndex={configurationStep}
                spaceEqually={true}>
                <ProgressStep
                  label='Panel Layout'
                />
                <ProgressStep
                  label="Panel Information"
                />
                <ProgressStep
                  label="Panel Configuration"
                />
              </ProgressIndicator>
            </Column>
          </Row><br/>
          { configurationStep === 0 &&
              <FormGroup legendText=''>
                <Row>
                  <Column>
                    <ComboBox
                      ariaLabel="Dropdown"
                      invalid={errors.layoutType.length > 0}
                      invalidText={errors.layoutType}
                      id="panelLayoutType"
                      placeholder='Are you using a controller or the shotbox?'
                      selectedItem={panel.layoutType || ''}
                      items={[{ id: 'controller', label: 'Controller Layout' }, { id: 'shotbox', label: 'Custom Shotbox Layout' }]}
                      onChange={(e) => { formOnChange('layoutType', e.selectedItem) }}
                      titleText="Panel Layout Type (required)"
                    /><br/>
                  </Column>
                </Row>
                { !panel.layoutType &&
                  <Row>
                    <Column>
                      <ComboBox
                        disabled
                        ariaLabel="Dropdown"
                        id="disabled"
                        placeholder='What layout is this panel?'
                        selectedItem={''}
                        items={[]}
                        onChange={() => {}}
                        titleText="Panel Layout (required)"
                      />
                    </Column>
                  </Row>
                }
                { panel.layoutType && panel.layoutType.id === 'controller' &&
                  <Row>
                    <Column>
                      <ComboBox
                        ariaLabel="Dropdown"
                        invalid={errors.layout}
                        invalidText={errors.layout}
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
                        titleText="Panel Layout (required)"
                      />
                    </Column>
                  </Row>
                }
                { panel.layoutType && panel.layoutType.id === 'shotbox' &&
                  <Row>
                    <Column>
                      <TextInput
                        type='text'
                        id='panelLayoutCustomY'
                        placeholder='How many rows is this shotbox?'
                        value={ panel.layout ? panel.layout.rows : undefined }
                        labelText='Rows (required)'
                        onClick={() => {}}
                        onChange={(e) => { setPanel({ ...panel, layout: { ...panel.layout, id: 'custom', rows: e.target.value } }) }}
                      />
                    </Column>
                    <Column>
                      <TextInput
                        type='text'
                        id='panelLayoutCustomX'
                        placeholder='How many buttons in each row?'
                        value={ panel.layout ? panel.layout.columns : undefined }
                        labelText='Columns (required)'
                        onClick={() => {}}
                        onChange={(e) => { setPanel({ ...panel, layout: { ...panel.layout, id: 'custom', columns: e.target.value } }) }}
                      />
                    </Column>
                  </Row>
                }
              </FormGroup>
          }
          { configurationStep === 1 &&
            <FormGroup legendText=''>
              <Row>
                <Column>
                  <TextInput
                    type='text'
                    id='panelName'
                    placeholder='Required'
                    value={panel.label}
                    labelText='Panel Label'
                    onClick={() => {}}
                    onChange={(e) => { setPanel({ ...panel, label: e.target.value }) }}
                  />
                </Column>
              </Row><br/>
              <Row>
                <Column>
                  <TextInput
                    type='text'
                    id='panelDescription'
                    placeholder='Optional'
                    value={panel.description || undefined}
                    labelText='Panel Description'
                    onClick={() => {}}
                    onChange={(e) => { setPanel({ ...panel, description: e.target.value }) }}
                  />
                </Column>
              </Row>
            </FormGroup>
          }
          { configurationStep === 2 &&
              <FormGroup legendText=''>
                <Row>
                  <Column>
                    <h4>Select a button to configure:</h4>
                  </Column>
                </Row>
                <Grid style={{ padding: '1em' }} condensed>
                  { panel.buttons && panel.buttons.map((row, rowIndex) => {
                    return (
                      <React.Fragment key={rowIndex}>
                        <Row>
                          { row.map((button, buttonIndex) => {
                            return (
                              <Column className="bx--button__field-wrapper" key={buttonIndex}>
                                <Button onClick={() => { setPanel({ ...panel, currentButton: button }) }} style={{ minWidth: '10px', padding: '10px', width: '100%', maxWidth: '500em', height: '8em', display: 'table' }} size='default' kind={getButtonColour(button)}>
                                  <>
                                    <h5>{button.stack?.id ? button.stack.panelLabel : ''}</h5>
                                    {button.stack?.id ? button.stack.label : ''}<br/>
                                    {button.stack?.id ? `ID: ${button.stack.id}` : ''}
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
                    <h4>Button Configuration for row {panel.currentButton.row + 1}, button {panel.currentButton.column + 1}:</h4>
                    <br/>
                    <div className="bx--row">
                      <div className="bx--col">
                        <ComboBox
                          ariaLabel="Dropdown"
                          id="buttonStackSelection"
                          placeholder='Filter...'
                          selectedItem={panel.currentButton.stack}
                          items={result.data.stacks}
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
              </FormGroup>
          }
          <Row>
            <Column style={{ marginLeft: '64.4%' }}>
              <ButtonSet>
                <Button renderIcon={ configurationStep === 0 ? Exit24 : ArrowLeft24} onClick={() => { configurationStep === 0 ? history.push({ pathname: '/config/panels' }) : setConfigurationStep(configurationStep - 1) }} size='default' kind="secondary">
                  { configurationStep === 0 ? 'Cancel' : 'Go Back' }
                </Button>
                  &nbsp;
                <Button renderIcon={ArrowRight24} onClick={() => {
                  switch (configurationStep) {
                    case 0: buildMatrix(); break
                    case 1: setConfigurationStep(2); break
                    case 2: updatePanel(); break
                  }
                }} size='default' kind="primary">
                  { configurationStep !== 2 ? 'Continue' : isNew ? 'Create Panel' : 'Update Panel' }
                </Button>
              </ButtonSet>
            </Column>
          </Row>
        </Grid>
      </Form>
    )
  }
}

export default Panel
