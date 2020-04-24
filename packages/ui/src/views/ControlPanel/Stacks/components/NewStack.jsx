import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Dropdown, TextInput, InlineLoading } from 'carbon-components-react'
import StackActions from './StackActions.jsx'
import GraphQLError from '../../components/GraphQLError.jsx'
import omit from 'lodash'

const NewStack = (props) => {
  const [newStack, setNewStack] = useState({})
  const [newStackItem, setNewStackItem] = useState({})
  const [newStackActions, setNewStackActions] = useState([])
  const [result] = useQuery({
    query: `query getDeviceFunctions {
      getDevices {
        name
        id
        provider
      }
      getProviders {
        id
        label
        providerFunctions {
          id
          label
          parameters {
            label
            id
            inputType
            regex
          }
        }
      }
    }`
  })

  const newStackMutationGQL = `mutation newStack($newStack: newStack) {
    newStack(stack: $newStack) {
      id
    }
  }`

  var [newStackMutationResult, newStackMutation] = useMutation(newStackMutationGQL)

  const submitNewStack = () => {
    console.log('submitting new stack')
    // const newStackActions
    const actions = []
    for (var key of Object.keys(newStackActions)) {
      console.log(key)
      console.log(newStackActions[key])
      actions.push(
        newStackActions[key]
      )
    }
    console.log({ newStack: { ...newStack, actions: actions } })
    // newStackMutation({ newStack: { ...omit({ ...newStack, actions: { ...newStackActions } }, '__typename') } }).then(console.log(newStackMutationResult))
    // eslint-disable-next-line react/prop-types
    props.visability(false)
  }

  return (
    <div className="bx--col-lg-10">
      <div className="bx--grid">
        <div className="bx--row">
          <h3 style={{
            margin: '1vh 0 2vh 1vw'
          }}> New Stack</h3>
        </div>
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='newStackName'
              placeholder='Required'
              labelText='Stack Name'
              onClick={() => {}}
              onChange={(e) => { setNewStack({ ...newStack, name: e.target.value }) }}
            />
          </div>
        </div><br/>
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col bx--col-lg-4">
            <TextInput
              type='text'
              id='newStackDescription'
              placeholder='Optional'
              labelText='Stack Description'
              onClick={() => {}}
              onChange={(e) => { setNewStack({ ...newStack, description: e.target.value }) }}
            />
          </div>
        </div><br/>
        <div className="bx--row">
          <h4 style={{
            margin: '1vh 0 2vh 1vw'
          }}>Stack Actions</h4>
        </div>
        <StackActions actions={newStackActions} />
        <div className="bx--row">
          { result.error && <GraphQLError error={result.error.message} /> }
          { result.fetching && <InlineLoading /> }
          { result.data &&
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
              <Dropdown
                ariaLabel="Dropdown"
                id="newDeviceProvider"
                label='Required'
                items={result.data.getDevices}
                itemToString={item => (item ? item.name : '')}
                // label="Provider"
                onChange={(dd) => { setNewStackItem({ ...newStackItem, device: dd.selectedItem }) }}
                titleText="Action Device"
              />
            </div>
          }
          { !newStackItem.device &&
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
              <Dropdown
                ariaLabel="Dropdown"
                disabled
                id="newDeviceProvider"
                label='Select A Device'
                items={''}
                titleText="Action Function"
              />
            </div>
          }
          { newStackItem.device && newStackItem.device.id !== '0' &&
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
              <Dropdown
                ariaLabel="Dropdown"
                id="newDeviceProvider"
                label='Required'
                items={result.data.getProviders.find(item => item.id === newStackItem.device.provider).providerFunctions}
                itemToString={item => (item ? item.label : '')}
                // label="Provider"
                onChange={(func) => { setNewStackItem({ ...newStackItem, providerFunction: func.selectedItem }) }}
                titleText="Action Function"
              />
            </div>
          }
          {/* TODO: Proper validation */}
          { !newStackItem.function &&
            <Button disabled style={{ height: '40px', marginTop: '24px', marginRight: '16px' }} size='small' kind="primary">
            Add Action
            </Button>
          }
          { newStackItem.function && newStackItem.device.id !== '0' &&
            <Button onClick={() => {
              setNewStackActions([...newStackActions, { id: newStackActions.length.toString(), deviceName: newStackItem.device.name, functionLabel: newStackItem.function.label, ...newStackItem }])
              setNewStackItem({})
            }} style={{ height: '40px', marginTop: '24px', marginRight: '16px' }} size='small' kind="primary">
            Add Action
            </Button>
          }
        </div><br/>
        { newStackItem.function && newStackItem.function.parameters &&
          newStackItem.function.parameters.map((parameter, index) => {
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
                        onClick={() => {}}
                        onChange={(e) => { setNewStackItem({ ...newStackItem, config: { ...newStackItem.config, [parameter.id]: e.target.value } }) }}
                      />
                    </div>
                  }
                </div><br/>
              </div>
            )
          })
        }
        <br/><br/>
        {JSON.stringify({ newStack: { ...newStack, actions: { ...newStackActions } } }) }
        <br/><br/>
        <Button onClick={() => { submitNewStack() }} style={{ minWidth: '20%' }} size='default' kind="primary">
          Submit
        </Button>
        <br/><br/>
      </div>
    </div>
  )
}

export default NewStack
