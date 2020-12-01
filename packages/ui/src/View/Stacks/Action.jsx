import React, { useState } from 'react'
import { useQuery } from 'urql'
import PropTypes from 'prop-types'
import { Button, Column, ComboBox, Row, TextInput, NumberInput } from 'carbon-components-react'
import { deviceFunctionQueryGQL } from './queries'
import { WarningAlt16 } from '@carbon/icons-react'
import STATUS from '../statusEnum'

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
    if (action.parameters.length === 0) {
      return ''
    } else {
      return action.parameters.find(p => p.id === id)?.value || ''
    }
  }

  if (!props.new && action.device.status === STATUS.DISABLED) {
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

  if (props.new || action.device.status !== STATUS.DISABLED) {
    return (
      <>
        <Row>
          <Column>
            <Row>
              <Column style={{ maxWidth: '13em' }}>
                <NumberInput
                  id='stackActionDelayInput'
                  label='Action Delay (ms)'
                  value={action.delay ?? 0}
                  onChange={e => setAction({ ...action, delay: e.imaginaryTarget.valueAsNumber })}
                  min={0}
                  step={100}
                />
              </Column>
              <Column>
                { props.new &&
                  <ComboBox
                    ariaLabel='Dropdown'
                    id='actionDevice'
                    placeholder='Filter...'
                    value={action.device}
                    items={props.devices.filter(device => device.status !== STATUS.DISABLED)}
                    onChange={(device) => {
                      device
                        ? setAction({ ...action, device: device.selectedItem })
                        : setAction({ ...action, device: undefined, providerFunction: undefined })
                    }}
                    onClick={() => { setAction(initialActionState) }}
                    titleText='Device'
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
                    ariaLabel='Dropdown'
                    id='newstackProvider'
                    placeholder='Filter...'
                    items={[]}
                    onChange={() => {}}
                    titleText='Function'
                    disabled
                  />
                }
                { action.device && props.new && !result.data &&
                  <ComboBox
                    ariaLabel='Dropdown'
                    id='newstackProvider'
                    placeholder='Filter...'
                    titleText='Function'
                    onChange={() => {}}
                    items={[]}
                    disabled
                  />
                }
                { action.device && props.new && result.data &&
                  <ComboBox
                    ariaLabel='Dropdown'
                    id='newstackProvider'
                    placeholder='Filter...'
                    items={result.data.deviceFunctions}
                    onChange={(providerFunction) => {
                      providerFunction.selectedItem
                        ? setAction({ ...action, providerFunction: { id: providerFunction.selectedItem.id, label: providerFunction.selectedItem.label } })
                        : setAction({ ...action, providerFunction: null })
                    }}
                    titleText='Function'
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
          <Column sm={3}>
            { result.data && action.device && action.providerFunction && result.data.deviceFunctions.find(providerFunction => providerFunction.id === action.providerFunction.id).parameters?.length > 0 &&
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
                              placeholder={parameter.placeholder}
                              labelText={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
                              value={getParameterValue(parameter.id)}
                              helperText={parameter.tooltip}
                              onChange={(e) => { setParameter(e.target.value, parameter.id) }}
                            />
                          </Column>
                        }
                        { parameter.inputType === 'comboBox' &&
                          <Column>
                            <ComboBox
                              ariaLabel='Dropdown'
                              id={parameter.id}
                              titleText={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
                              helperText={parameter.tooltip}
                              placeholder={parameter.placeholder}
                              items={parameter.items}
                              selectedItem={getParameterValue(parameter.id)}
                              onChange={(e) => { setParameter(e.selectedItem, parameter.id) }}
                            />
                          </Column>
                        }
                        { parameter.inputType === 'numberInput' &&
                          <Column>
                            <NumberInput
                              id={parameter.id}
                              label={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
                              helperText={parameter.tooltip}
                              placeholder={parameter.placeholder}
                              invalidText={parameter.invalidText ?? 'Input is invalid'}
                              value={getParameterValue(parameter.id) || 0}
                              onChange={e => !isNaN(e.imaginaryTarget.valueAsNumber) && setParameter(e.imaginaryTarget.valueAsNumber, parameter.id)}
                              {...() => (parameter.min && { min: parameter.min })}
                              {...() => (parameter.max && { max: parameter.max })}
                            />
                          </Column>
                        }
                      </Row>
                      <br/>
                    </React.Fragment>
                  )
                })
            }
            { result.data && action.providerFunction && !result.data.deviceFunctions.find(providerFunction => providerFunction.id === action.providerFunction.id).parameters &&
              <Row>
                <Column>
                  <br/><br/>
                  <strong>This function has no configurable parameters</strong>
                </Column>
              </Row>
            }
          </Column>
          <Column>
            <br/><br/>
            { props.new &&
              <Button
                onClick={() => {
                  props.setActions(action, -1)
                  setAction(initialActionState)
                }}
                disabled={!action.providerFunction}
                size='small'
                kind='primary'
                style={{ width: '13em', minWidth: '13em' }}
              >
                Add to Stack
              </Button>
            }
            { !props.new &&
              <>
                <Button
                  onClick={() => {
                    props.setActions(action, props.index)
                    setActionComparisonStore(action)
                  }}
                  size='small'
                  kind='primary'
                  style={{ width: '13em', minWidth: '13em' }}
                  disabled={actionComparisonStore === action}
                >
                  Update Action
                </Button><br/>
                <Button onClick={() => { props.delete(props.index) }} size='small' kind='danger' style={{ width: '13em', minWidth: '13em' }}>
                  Delete Action
                </Button>
              </>
            }
          </Column>
        </Row>
        <br/>
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
