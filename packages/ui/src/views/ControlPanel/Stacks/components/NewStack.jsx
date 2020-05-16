import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Dropdown, TextInput, InlineLoading } from 'carbon-components-react'
import StackActions from './StackActions.jsx'
import GraphQLError from '../../components/GraphQLError.jsx'

// TODO: Step times and delays
// TODO: edit stacks
// TODO: edit actions
// TODO: fix that weird bug with updating the dropdown on action submit

const NewStack = (props) => {
  const [newStack, setNewStack] = useState({})
  const [newStackItem, setNewStackItem] = useState({})
  const [newStackActions, setNewStackActions] = useState([])
  const [result] = useQuery({
    query: `query getDeviceFunctions {
      getDevices {
        label
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

  const newStackMutationGQL = `mutation newStack($newStack: StackInput) {
    newStack(stack: $newStack) {
      id
    }
  }`

  var [newStackMutationResult, newStackMutation] = useMutation(newStackMutationGQL)

  const submitNewStack = () => {
    console.log('submitting new stack')
    newStackMutation({ newStack: { ...newStack, actions: newStackActions } })
    // eslint-disable-next-line react/prop-types
    props.visability(false)
    console.log(newStackMutationResult)
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
                itemToString={item => (item ? item.label : '')}
                // label="Provider"
                onChange={(dd) => { setNewStackItem({ ...newStackItem, device: dd.selectedItem }) }}
                titleText="Action Device"
              />
            </div>
          }
          { !newStackItem.device &&
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
              <Dropdown
                disabled
                ariaLabel="Dropdown"
                id="newDeviceProvider"
                titleText="Action Function"
                items={[]}
              />
            </div>
          }
          { newStackItem.device && newStackItem.device.id !== '0' &&
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
              <Dropdown
                ariaLabel="Dropdown"
                id="newActionFunction"
                label='Required'
                items={result.data.getProviders.find(item => item.id === newStackItem.device.provider).providerFunctions}
                onChange={(func) => { setNewStackItem({ ...newStackItem, providerFunction: func.selectedItem }) }}
                titleText="Action Function"
              />
            </div>
          }
        </div><br/>
        { newStackItem.providerFunction && newStackItem.providerFunction.parameters &&
          newStackItem.providerFunction.parameters.map((parameter, index) => {
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
                        onChange={(e) => { setNewStackItem({ ...newStackItem, parameters: { ...newStackItem.parameters, [parameter.id]: e.target.value } }) }}
                      />
                    </div>
                  }
                </div><br/>
              </div>
            )
          })
        }
        <div>
          { !newStackItem.providerFunction &&
            <Button disabled style={{ minWidth: '20%' }} size='default' kind="primary">
            Add Action
            </Button>
          }
          { newStackItem.providerFunction && newStackItem.device.id !== '0' &&
            <Button onClick={() => {
              var parameters = []
              for (var key of Object.keys(newStackItem.parameters)) {
                parameters.push({
                  id: `${key}`,
                  value: newStackItem.parameters[key]
                })
              }
              var temp = [...newStackActions]
              temp.push(
                {
                  id: newStackActions.length.toString(),
                  deviceid: newStackItem.device.id,
                  providerFunctionID: newStackItem.providerFunction.id,
                  functionLabel: newStackItem.providerFunction.label,
                  parameters: parameters
                }
              )
              setNewStackActions(temp)
              setNewStackItem({})
            }} style={{ minWidth: '20%' }} size='default' kind="primary">
            Add Action
            </Button>
          }
          { newStackActions.length > 0 &&
          <Button onClick={() => { submitNewStack() }} style={{ minWidth: '20%' }} size='default' kind="primary">
            Add Stack
          </Button>
          }
          { newStackActions.length === 0 &&
          <Button disabled style={{ minWidth: '20%' }} size='default' kind="primary">
            Add Stack
          </Button>
          }
        </div>
        <br />
      </div>
    </div>
  )
}

export default NewStack
