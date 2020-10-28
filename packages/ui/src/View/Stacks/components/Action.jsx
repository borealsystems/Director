import React, { useState } from 'react'
import { useQuery } from 'urql'
import PropTypes from 'prop-types'
import { Button, Column, ComboBox, Row, TextInput } from 'carbon-components-react'
import { ArrowDown16, ArrowUp16 } from '@carbon/icons-react'
import { findIndex, find } from 'lodash'
import { deviceFunctionQueryGQL } from '../queries'

const arrayMove = (array, from, to) => {
  array = array.slice()
  const startIndex = to < 0 ? array.length + to : to
  const item = array.splice(from, 1)[0]
  array.splice(startIndex, 0, item)
  return array
}

const Action = (props) => {
  var initialActionState = {}
  if (props.new) {
    initialActionState = { parameters: [] }
  } else {
    initialActionState = { ...props.actions[props.index] }
  }
  var [action, setAction] = useState(initialActionState)
  var [actionComparisonStore] = useState(initialActionState)

  const [result] = useQuery({
    query: deviceFunctionQueryGQL,
    pollInterval: 1000,
    variables: { id: action?.device?.id },
    pause: !action.device?.id
  })

  const getActionMoveButtons = () => {
    if (props.actions.length === 1) {
      return (<></>)
    } else if (props.index === 0) {
      return (
        <>
          <div>
            <span style={{ display: 'inline-block', paddingTop: '10px' }}>Move Action:</span>
            <span style={{ display: 'inline-block', width: '44px' }}>&nbsp;</span>
            <Button onClick={() => {
              const mutatedActionArray = arrayMove(props.actions, props.index, props.index + 1)
              props.setActions(mutatedActionArray)
            }} size='small' kind="ghost">
              <ArrowDown16 />
            </Button>
          </div>
          <br/>
        </>
      )
    } else if (props.index > 0 && props.index < props.actions.length - 1) {
      return (
        <>
          <div>
            <span style={{ display: 'inline-block', paddingTop: '10px' }}>Move Action:</span>
            <Button onClick={() => { props.setActions(arrayMove(props.actions, props.index, props.index - 1)) }} size='small' kind="ghost">
              <ArrowUp16 />
            </Button>
            <Button onClick={() => { props.setActions(arrayMove(props.actions, props.index, props.index + 1)) }} size='small' kind="ghost">
              <ArrowDown16 />
            </Button>
          </div>
          <br/>
        </>
      )
    } else if (props.index === props.actions.length - 1) {
      return (
        <>
          <div>
            <span style={{ display: 'inline-block', paddingTop: '10px' }}>Move Action:</span>
            <Button onClick={() => { props.setActions(arrayMove(props.actions, props.index, props.index - 1)) }} size='small' kind="ghost">
              <ArrowUp16 />
            </Button>
            <span style={{ display: 'inline-block', width: '44px' }}>&nbsp;</span>
          </div>
          <br/>
        </>
      )
    }
  }

  return (
    <>
      <Row>
        <Column>
          { !props.new &&
          <h5>Action {props.index + 1}: {action.providerFunction.label} on {action.device.label}</h5>
          }
          { props.new &&
            <h5>New Action</h5>
          }
        </Column>
      </Row>
      <br/>
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
                  items={props.devices}
                  // itemToString={item => (item ? item.label : '')}
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
                  onChange={null}
                  disabled
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
                  onChange={null}
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
                  disabled
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
                            value={action.parameters.find(e => e.id === parameter.id).value || ''}
                            onClick={() => {}}
                            onChange={(e) => {
                              var parameterArray = [...action.parameters]
                              if (findIndex(action.parameters, element => element.id === parameter.id) !== -1) {
                                find(parameterArray, element => element.id === parameter.id).value = e.target.value
                                setAction({ ...action, parameters: [...parameterArray] })
                              } else {
                                parameterArray.push({ id: parameter.id, value: e.target.value })
                                setAction({ ...action, parameters: [...parameterArray] })
                              }
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
                            selectedItem={action.parameters.find(e => e.id === parameter.id).value || ''}
                            onChange={(e) => {
                              var parameterArray = [...action.parameters]
                              if (findIndex(action.parameters, element => element.id === parameter.id) !== -1) {
                                find(parameterArray, element => element.id === parameter.id).value = e.selectedItem
                                setAction({ ...action, parameters: [...parameterArray] })
                              } else {
                                parameterArray.push({ id: parameter.id, value: e.selectedItem })
                                setAction({ ...action, parameters: [...parameterArray] })
                              }
                            }}
                            titleText={parameter.id}
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
          { !props.new && getActionMoveButtons() }
          { props.new && action.providerFunction &&
            <Button onClick={() => {
              const actionsArray = props.actions
              actionsArray.push(action)
              props.setActions(actionsArray)
              setAction(initialActionState)
            }} size='small' kind="primary">
              Add
            </Button>
          }
          { props.new && !action.providerFunction &&
            <Button onClick={() => {}} size='small' kind="primary" disabled>
              Add
            </Button>
          }
          { !props.new && actionComparisonStore !== action &&
            <>
              <Button onClick={() => {
                const actionsArray = props.actions
                actionsArray[props.index] = action
                props.setActions(actionsArray)
                setAction(initialActionState)
              }} size='small' kind="primary">
                Update
              </Button>
              <Button onClick={() => { props.actions.splice(props.index, 1) }} size='small' kind="danger" style={{ minWidth: '17%' }}>
                Delete
              </Button>
            </>
          }
          { !props.new && actionComparisonStore === action &&
            <>
              <Button disabled size='small' kind="primary">
                Update
              </Button>
              <Button onClick={() => { props.actions.splice(props.index, 1) }} size='small' kind="danger" style={{ minWidth: '17%' }}>
                Delete
              </Button>
            </>
          }
        </Column>
      </Row>
    </>
  )
}

Action.propTypes = {
  actions: PropTypes.array,
  setActions: PropTypes.func,
  devices: PropTypes.array,
  providers: PropTypes.array,
  actionID: PropTypes.string,
  new: PropTypes.bool,
  index: PropTypes.number
}

export default Action
