import React, { useState } from 'react'
import { useQuery } from 'urql'
import PropTypes from 'prop-types'
import { Button, Column, ComboBox, Row, TextInput } from 'carbon-components-react'
import { deviceFunctionQueryGQL } from './queries'
import { WarningAlt16 } from '@carbon/icons-react'

const Action = (props) => {
  var initialActionState = {}
  if (props.new) {
    initialActionState = { parameters: [] }
  } else {
    initialActionState = { ...props.action }
  }
  var [action, setAction] = useState(initialActionState)
  var [actionComparisonStore, setActionComparisonStore] = useState(initialActionState)

  const [result] = useQuery({
    query: deviceFunctionQueryGQL,
    variables: { id: action?.device?.id },
    pause: !action.device?.id
  })

  const setParameter = (value, id) => {
    const parameterArray = [...action.parameters]
    if (parameterArray.find(element => element.id === id)) {
      parameterArray.find(element => element.id === id).value = value
      setAction({ ...action, parameters: parameterArray })
    } else {
      parameterArray.push({ id: id, value: value })
      setAction({ ...action, parameters: parameterArray })
    }
  }

  const getParameterValue = id => {
    if (action.parameters.length === 0) return ''
    if (props.new) {
      return action.parameters.filter(p => p.id === id).value
    } else {
      return action.parameters.find(p => p.id === id).value
    }
  }

  if (!props.new && action.device.enabled === false) {
    return (
      <>
        <Row>
          <Column>
            <WarningAlt16 style={{ transform: 'translate(0, 0.3em)' }}/> This device is disabled or offline, enable it to reconfigure this action.
          </Column>
        </Row>
      </>
    )
  }

  if (props.new || action.device.enabled === true) {
    return (
      <>
        <Row>
          <Column>
            <Row>
              <Column>
                { props.new &&
                  <ComboBox
                    ariaLabel="Dropdown"
                    id="actionDevice"
                    placeholder='Filter...'
                    value={action.device}
                    items={props.devices.filter(device => device.enabled)}
                    onChange={(device) => { setAction({ ...action, device: device.selectedItem }) }}
                    titleText="Device"
                  />
                }
                { !props.new &&
                  <TextInput
                    type='text'
                    id='actionDevice'
                    placeholder='Filter...'
                    labelText='Device'
                    value={action.device.label}
                    onClick={() => {}}
                    onChange={() => {}}
                    readOnly
                  />
                }
              </Column>
              <Column>
                { !action.device &&
                  <ComboBox
                    ariaLabel="Dropdown"
                    id="newstackProvider"
                    placeholder='Filter...'
                    items={[]}
                    onChange={() => {}}
                    titleText="Function"
                    disabled
                  />
                }
                { action.device && props.new && !result.data &&
                  <ComboBox
                    ariaLabel="Dropdown"
                    id="newstackProvider"
                    placeholder='Filter...'
                    titleText="Function"
                    onChange={() => {}}
                    items={[]}
                    disabled
                  />
                }
                { action.device && props.new && result.data &&
                  <ComboBox
                    ariaLabel="Dropdown"
                    id="newstackProvider"
                    placeholder='Filter...'
                    items={result.data.deviceFunctions}
                    onChange={(providerFunction) => { setAction({ ...action, providerFunction: { id: providerFunction.selectedItem.id, label: providerFunction.selectedItem.label } }) }}
                    titleText="Function"
                  />
                }
                { action.device && !props.new &&
                  <TextInput
                    type='text'
                    id='actionDeviceFunction'
                    placeholder='Required'
                    labelText='Function'
                    value={action.providerFunction.label}
                    onClick={() => {}}
                    onChange={null}
                    readOnly
                  />
                }
              </Column>
            </Row>
          </Column>
        </Row><br/>
        <Row>
          <Column>
            { result.data && action.providerFunction && result.data.deviceFunctions.find(providerFunction => providerFunction.id === action.providerFunction.id).parameters.length > 0 &&
              result.data.deviceFunctions.find(providerFunction => providerFunction.id === action.providerFunction.id).parameters
                .map((parameter, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Row>
                        { parameter.inputType === 'textInput' &&
                          <Column>
                            <TextInput
                              type='text'
                              id={parameter.id}
                              placeholder='Required'
                              labelText={parameter.label}
                              value={getParameterValue(parameter.id) || null}
                              onClick={() => {}}
                              onChange={(e) => {
                                setParameter(e.target.value, parameter.id)
                              }}
                            />
                          </Column>
                        }
                        { parameter.inputType === 'comboBox' &&
                          <Column>
                            <ComboBox
                              ariaLabel="Dropdown"
                              id={parameter.id}
                              placeholder='Filter...'
                              items={parameter.items}
                              selectedItem={getParameterValue(parameter.id) || null}
                              onChange={(e) => {
                                setParameter(e.selectedItem, parameter.id)
                              }}
                              titleText={parameter.label}
                            />
                          </Column>
                        }
                      </Row>
                      <br/>
                    </React.Fragment>
                  )
                })
            }
          </Column>
          <Column>
            <br/><br/>
            { props.new && action.providerFunction &&
              <Button onClick={() => {
                props.setActions(action, -1)
                setAction(initialActionState)
              }} size='small' kind="primary">
                Add to Stack
              </Button>
            }
            { !props.new && actionComparisonStore !== action &&
              <>
                <Button onClick={() => {
                  props.setActions(action, props.index)
                  setActionComparisonStore(action)
                }} size='small' kind="primary">
                  Update Action
                </Button>
                <Button onClick={() => { props.delete(props.index) }} size='small' kind="danger" style={{ minWidth: '17%' }}>
                  Delete Action
                </Button>
              </>
            }
            { !props.new && actionComparisonStore === action &&
              <>
                <Button disabled size='small' kind="primary">
                  Update Action
                </Button>
                <Button onClick={() => { props.delete(props.index) }} size='small' kind="danger" style={{ minWidth: '17%' }}>
                  Delete Action
                </Button>
              </>
            }
          </Column>
        </Row>
        <br/><br/>
      </>
    )
  }
}

Action.propTypes = {
  action: PropTypes.object,
  setActions: PropTypes.func,
  delete: PropTypes.func,
  devices: PropTypes.array,
  providers: PropTypes.array,
  new: PropTypes.bool,
  index: PropTypes.number
}

export default Action
