import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, ComboBox, TextInput } from 'carbon-components-react'
import { ArrowDown16, ArrowUp16 } from '@carbon/icons-react'
import { findIndex, find } from 'lodash'

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
      <div className="bx--row">
        <div className="bx--col" style={{ maxWidth: '33%' }}>
          { !props.new &&
            <h5>Action {props.index + 1}: {action.providerFunction.label} on {action.device.label}</h5>
          }
          { props.new &&
            <h5>New Action</h5>
          }
          <br/>
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
        </div>
        <div className="bx--col">
          <div className="bx--row">
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
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
            </div>
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
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
              { action.device && props.new &&
                <ComboBox
                  ariaLabel="Dropdown"
                  id="newstackProvider"
                  placeholder='Filter...'
                  items={props.providers.find(provider => provider.id === action.device.provider.id).providerFunctions}
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
            </div>
          </div>
          <br/>
          { action.providerFunction &&
            props.providers.find(provider => provider.id === action.device.provider.id)
              .providerFunctions.find(providerFunction => providerFunction.id === action.providerFunction.id).parameters
              .map((parameter, index) => {
                return (
                  <div key={index}>
                    <div key={index} className="bx--row">
                      { parameter.inputType === 'textInput' &&
                        <div className="bx--text-input__field-wrapper bx--col bx--col-lg-4">
                          <TextInput
                            type='text'
                            id={parameter.id}
                            placeholder='Required'
                            labelText={parameter.label}
                            value={find(action.parameters, element => element.id === parameter.id)?.value }
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
                        </div>
                      }
                    </div><br/>
                  </div>
                )
              })
          }
        </div>
      </div>
      <br/>
      <hr style={{ borderTop: 'dotted 1px', borderBottom: '0px' }} />
      <br/>
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
