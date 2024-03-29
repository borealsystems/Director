import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'urql'

import {
  Button,
  ButtonSet,
  Column,
  ComboBox,
  ContentSwitcher,
  DataTable,
  Form,
  Grid,
  InlineLoading,
  Loading,
  NumberInput,
  Row,
  Switch,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  TextInput
} from 'carbon-components-react'

import {
  ArrowRight24,
  Exit24,
  Tag16
} from '@carbon/icons-react'

import { omit } from 'lodash'

import { panelUpdateMutationGQL } from './queries'
import stackSelectionHeaders from './stackSelectionHeaders'

import globalContext from '../../globalContext'

const Panel = ({ id, result }) => {
  const { contextRealm } = useContext(globalContext)
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
  const [panel, setPanel] = useState(initialPanel)
  const [currentButton, setCurrentButton] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [configurationStep, setConfigurationStep] = useState(0)
  const [filter, setFilter] = useState('')

  const [, panelUpdateMutation] = useMutation(panelUpdateMutationGQL)

  const updatePanel = () => {
    setIsLoading(true)
    const stackUpdateObject = {
      panel: {
        ...omit(panel, 'currentButton'),
        realm: contextRealm.id,
        core: contextRealm.coreID,
        buttons: panel.buttons.map(row => row.map(button => {
          button.stack && ( button.stack = { id: button.stack.id } )
        }))
      }
    }
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

  const getTypeProps = (button) => {
    if (button.stack) {
      return { kind: 'primary' }
    } else {
      return { kind: 'secondary' }
    }
  }

  const assignButton = id => {
    const panelIntermediate = { ...panel }
    panelIntermediate.buttons[currentButton.row][currentButton.column].stack = result.data.stacks.find(stack => stack.id === id)
    setPanel(panelIntermediate)
  }

  if (result.fetching) { return <Loading /> }
  if (result.data) {
    const rawData = result.data.stacks
    const filteredTableData = rawData.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase()) ||
         e.panelLabel?.toLowerCase().includes(filter.toLowerCase()) ||
         e.description?.toLowerCase().includes(filter.toLowerCase()) ||
         e.tags?.filter(t => t.label.toLowerCase().includes(filter.toLowerCase())).length > 0 ||
         e.tags?.filter(t => t.id.toLowerCase().includes(filter.toLowerCase())).length > 0
        })
        
    return (
      <Form>
        <Grid>
          <Row>
            <Column>
              <h3>{ id === 'new' ? 'New Panel' : { ...panel }.label || ' ' }</h3><br/>
            </Column>
          </Row>
          <ContentSwitcher onChange={() => {}}>
            <Switch name='one' onClick={() => setConfigurationStep(0)} text="Configure Panel Details" />
            <Switch name='two' onClick={() => setConfigurationStep(1)} text="Configure Panel Buttons" />
          </ContentSwitcher><br/>
          { configurationStep === 0 &&
            <>
            <Row>
              <Column>
                <TextInput
                  type='text'
                  id='panelName'
                  placeholder='Required'
                  value={panel.label}
                  labelText='Panel Label'
                  onClick={() => {}}
                  onChange={(e) => { setPanel({ ...panel, label: e.target.value.slice(0, 100) }) }}
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
                  onChange={(e) => { setPanel({ ...panel, description: e.target.value.slice(0, 250) }) }}
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
            </>
          }
          { configurationStep === 1 &&
            <>
                <Grid style={{ padding: '1em' }} condensed>
                  { panel.buttons && panel.buttons.map((row, rowIndex) => {
                    return (
                      <React.Fragment key={rowIndex}>
                        <Row>
                          { row.map((button, buttonIndex) => {
                            return (
                              <Column className='bx--button__field-wrapper' key={buttonIndex}>
                                <Button
                                  onClick={() => { setCurrentButton({ row: button.row, column: button.column } ) }}
                                  style={{
                                    minWidth: '10px',
                                    padding: '10px',
                                    width: '100%',
                                    maxWidth: '500em',
                                    height: '8em',
                                    display: 'table',
                                    backgroundColor: button.stack?.colour?.id,
                                    outline: rowIndex === currentButton.row && buttonIndex === currentButton.column ? '1px solid white' : null
                                  }}
                                  {...getTypeProps(button)}
                                  size='default'
                                >
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

              { false && panel.layout?.rows && panel.layout?.columns && currentButton.row != null &&
                <>
                  <DataTable
                    rows={filteredTableData}
                    headers={stackSelectionHeaders}
                    radio
                    stickyHeader={true}
                  >
                    {({
                      rows,
                      headers,
                      getHeaderProps,
                      getRowProps,
                      getSelectionProps,
                      getTableProps,
                      getTableContainerProps,
                      getToolbarProps,
                      selectRow,
                      selectedRows
                    }) => (
                      <TableContainer {...getTableContainerProps()}>
                          <TableToolbar {...getToolbarProps()} aria-label='data table toolbar'>
                          <TableToolbarContent>
                            <TableToolbarSearch placeholder='Filter by ID, Name, Panel Label, Description, or Tags' onChange={(e) => setFilter(e.target.value)} defaultExpanded />
                            <Button
                              onClick={(stack) => {
                                const panelIntermediate = { ...panel }
                                panelIntermediate.buttons[currentButton.row][currentButton.column].stack = null
                                setPanel(panelIntermediate)
                              }}
                              size='small'
                              disabled={!panel.buttons[currentButton.row][currentButton.column].stack}
                              kind='danger'>
                              Clear Button
                            </Button>
                          </TableToolbarContent>
                        </TableToolbar>
                        <Table {...getTableProps()}>
                          <TableHead>
                            <TableRow>
                              <th scope="col" />
                              {headers.map((header, i) => (
                                <TableHeader key={i} {...getHeaderProps({ header })}>
                                  {header.header}
                                </TableHeader>
                              ))}
                              <TableHeader style={{ width: '50em' }}>
                                Tags
                              </TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody style={{ height: '100%', overflow: 'auto'}}>
                            {rows.map((row, i) => (
                              <TableRow key={i} {...getRowProps({ row })} onClick={() => selectRow(row.id)}>
                                <TableSelectRow {...getSelectionProps({ row })} />
                                {row.cells.map((cell) => (
                                  <TableCell key={cell.id}>{cell.value}</TableCell>
                                ))}
                                <TableCell>
                                  {filteredTableData[i]?.tags?.map((tag, index) => (
                                    <Tag key={tag.id} size='sm' renderIcon={Tag16} style={{ color: 'white', backgroundColor: tag.colour.id.concat('E5') }}>
                                      {tag.label}
                                    </Tag>
                                  ))}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </DataTable>
                </>
              }
              { panel.layout?.rows && panel.layout?.columns && currentButton.row != null &&
                <Row>
                  <Column>
                    <ComboBox
                      ariaLabel='Dropdown'
                      id='buttonStackSelection'
                      placeholder='Filter...'
                      direction='top'
                      selectedItem={panel.buttons[currentButton.row][currentButton.column].stack ?? ''}
                      items={result.data.stacks}
                      itemToString={(item) => (item ? `${item.label}  ${item.panelLabel ? `|  ${item.panelLabel}` : ''}` : null)}
                      onChange={(stack) => {
                        const panelIntermediate = { ...panel }
                        panelIntermediate.buttons[currentButton.row][currentButton.column].stack = stack.selectedItem
                        setPanel(panelIntermediate)
                      }}
                      titleText='Stack'
                    />
                  </Column>
                  <Column>
                    { panel.buttons[currentButton.row][currentButton.column].stack &&
                      <Button onClick={(stack) => {
                        const panelIntermediate = { ...panel }
                        panelIntermediate.buttons[currentButton.row][currentButton.column].stack = null
                        setPanel(panelIntermediate)
                      }} size='small' style={{ marginTop: '25px', height: '40px' }} kind='danger'>
                        Clear Button
                      </Button>
                    }
                    { !panel.buttons[currentButton.row][currentButton.column].stack &&
                      <Button disabled onClick={() => {}} size='small' style={{ marginTop: '25px', height: '40px' }} kind='danger'>
                        Clear Button
                      </Button>
                    }
                  </Column>
                </Row>
              }
            </>
          }
          <br/><br/>
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
          <br/><br/>
          <br/><br/>
        </Grid>
      </Form>
    )
  }
}

export default Panel
