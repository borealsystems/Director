import React, { useState, useContext } from 'react'
import { Button, ButtonSet, ComboBox, TextInput, Form, Grid, Row, Column, Loading, InlineLoading, NumberInput } from 'carbon-components-react'
import { ArrowRight24, Exit24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'
import { omit } from 'lodash'
import { useMutation } from 'urql'
import { panelUpdateMutationGQL } from './queries'
import globalContext from '../../globalContext'

const Panel = ({ id, result }) => {
  const { contextRealm } = useContext(globalContext)
  const isNew = id === 'new'
  const history = useHistory()

  let initialPanel = {}
  if (isNew) {
    initialPanel = { currentButton: { row: 0, column: 0 } }
  } else {
    const thisPanel = isNew ? null : { ...result.data.panel }
    const buttons = []
    if (thisPanel.buttons) thisPanel.buttons.map(row => { buttons.push(Object.keys(row).map((key) => { return row[key] })) })
    initialPanel = { ...thisPanel, buttons: buttons }
  }
  var [panel, setPanel] = useState(initialPanel)
  const [isLoading, setIsLoading] = useState(false)

  const [, panelUpdateMutation] = useMutation(panelUpdateMutationGQL)

  const updatePanel = () => {
    setIsLoading(true)
    const stackUpdateObject = { panel: { ...omit(panel, 'currentButton'), realm: contextRealm.id, core: contextRealm.coreID } }
    panelUpdateMutation(stackUpdateObject)
      .then(result => {
        if (result.data) {
          setIsLoading(false)
          history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels` })
        } else if (result.error) setIsLoading(false)
      })
  }

  const matrix = (rows, cols) => {
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
              <h3>{ id === 'new' ? 'New Panel' : { ...panel }.label || ' ' }</h3><br/>
            </Column>
          </Row>
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
          </Row><br/>
          <Row>
            <Column>
              <ComboBox
                ariaLabel='Dropdown'
                id='panelLayoutType'
                placeholder='Predefined layout or custom shotbox?'
                selectedItem={panel.layoutType || ''}
                items={[{ id: 'controller', label: 'Controller Layout' }, { id: 'shotbox', label: 'Custom Shotbox Layout' }]}
                onChange={(e) => { setPanel({ ...panel, layoutType: e.selectedItem }) }}
                titleText='Panel Layout Type'
              /><br/>
            </Column>
          </Row>
          { !panel.layoutType &&
            <Row>
              <Column>
                <ComboBox
                  disabled
                  ariaLabel='Dropdown'
                  id='disabled'
                  placeholder='What layout is this panel?'
                  selectedItem={''}
                  items={[]}
                  onChange={() => {}}
                  titleText='Panel Layout'
                />
              </Column>
            </Row>
          }
          { panel.layoutType && panel.layoutType.id === 'controller' &&
            <Row>
              <Column>
                <ComboBox
                  ariaLabel='Dropdown'
                  id='panelLayoutController'
                  placeholder='Filter...'
                  selectedItem={panel.layout}
                  items={result.data.controllerLayouts}
                  onChange={(layout) => {
                    setPanel({ ...panel, layout: layout.selectedItem, buttons: matrix(layout.selectedItem.rows, layout.selectedItem.columns) })
                  }}
                  titleText='Panel Layout'
                />
              </Column>
            </Row>
          }
          { panel.layoutType && panel.layoutType.id === 'shotbox' &&
            <Row>
              <Column>
                <NumberInput
                  id='panelLayoutCustomX'
                  label='Columns'
                  placeholder={0}
                  invalidText='Please enter a value between 1 and 20'
                  warn={panel.layout && panel.layout.columns > 10}
                  warnText='It may be difficult to use a panel with more than 10 columns on some devices as the labels may not fit'
                  value={panel.layout ? panel.layout.columns : undefined}
                  onChange={e => !isNaN(e.imaginaryTarget.valueAsNumber) && setPanel({ ...panel, layout: { ...panel.layout, id: 'custom', columns: e.imaginaryTarget.valueAsNumber }, buttons: panel.layout?.rows ? matrix(panel.layout.rows, e.imaginaryTarget.valueAsNumber) : undefined })}
                  min={1}
                  max={20}
                />
              </Column>
              <Column>
                <NumberInput
                  id='panelLayoutCustomY'
                  label='Rows'
                  placeholder={0}
                  invalidText='Please enter a value between 1 and 30'
                  warn={panel.layout && panel.layout.rows > 7}
                  warnText='It may be difficult to use a panel with more than 7 rows on some devices as they will not all fit on the screen'
                  value={panel.layout ? panel.layout.rows : undefined}
                  onChange={e => !isNaN(e.imaginaryTarget.valueAsNumber) && setPanel({ ...panel, layout: { ...panel.layout, id: 'custom', rows: e.imaginaryTarget.valueAsNumber }, buttons: panel.layout?.columns ? matrix(e.imaginaryTarget.valueAsNumber, panel.layout.columns) : undefined })}
                  min={1}
                  max={30}
                />
              </Column>
            </Row>
          }
          <br/>
          <Grid style={{ padding: '1em' }} condensed>
            { panel.buttons && panel.buttons.map((row, rowIndex) => {
              return (
                <React.Fragment key={rowIndex}>
                  <Row>
                    { row.map((button, buttonIndex) => {
                      return (
                        <Column className='bx--button__field-wrapper' key={buttonIndex}>
                          <Button onClick={() => { setPanel({ ...panel, currentButton: { ...button, stack: button.stack ?? null } }) }} style={{ minWidth: '10px', padding: '10px', width: '100%', maxWidth: '500em', height: '8em', display: 'table' }} size='default' kind={getButtonColour(button)}>
                            <>
                              <h5>{button.stack?.id ? button.stack.panelLabel : ''}</h5>
                              {button.stack?.id ? button.stack.label : ''}<br/>
                              {button.stack?.id ? `ID: ${button.stack.id}` : ''}
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
          { panel.layout?.rows && panel.layout?.columns && panel.currentButton &&
            <>
              <div className='bx--row'>
                <div className='bx--col'>
                  <ComboBox
                    ariaLabel='Dropdown'
                    id='buttonStackSelection'
                    placeholder='Filter...'
                    direction='top'
                    selectedItem={panel.currentButton.stack ?? ''}
                    items={result.data.stacks}
                    itemToString={(item) => (item ? `${item.label}  |  ${item.panelLabel}` : null)}
                    onChange={(stack) => {
                      const panelIntermediate = { ...panel }
                      panelIntermediate.buttons[panel.currentButton.row][panel.currentButton.column].stack = stack.selectedItem
                      setPanel(panelIntermediate)
                    }}
                    titleText='Stack'
                  />
                </div>
                <div className='bx--col'>
                  { panel.currentButton?.stack &&
                    <Button onClick={(stack) => {
                      const panelIntermediate = { ...panel }
                      panelIntermediate.buttons[panel.currentButton.row][panel.currentButton.column].stack = null
                      setPanel(panelIntermediate)
                    }} size='small' style={{ marginTop: '25px', height: '40px' }} kind='danger'>
                      Clear Button
                    </Button>
                  }
                  { !panel.currentButton?.stack &&
                    <Button disabled onClick={() => {}} size='small' style={{ marginTop: '25px', height: '40px' }} kind='danger'>
                      Clear Button
                    </Button>
                  }
                </div>
              </div>
              <br/><br/>
            </>
          }
          <Row>
            <Column>
              <ButtonSet style={{ float: 'right', marginRight: '7em' }}>
                <Button
                  renderIcon={Exit24}
                  onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels` }) }}
                  size='default' kind='secondary'
                >
                  Go Back
                </Button>
                { isLoading
                  ? <InlineLoading description='Creating Panel' status='active' />
                  : <Button
                    disabled={!panel.buttons || !panel.label}
                    renderIcon={ArrowRight24}
                    onClick={() => { updatePanel() }}
                    size='default'
                    kind='primary'>
                    { isNew ? 'Create Panel' : 'Update Panel' }
                  </Button>
                }
              </ButtonSet>
            </Column>
          </Row>
        </Grid>
      </Form>
    )
  }
}

export default Panel
