import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, Dropdown, TextInput, InlineLoading, InlineNotification } from 'carbon-components-react'

const NewStack = (props) => {
  const [newStack, setNewStack] = useState({})
  const [newStackItem, setNewStackItem] = useState({})
  const [stackActions, setStackActions] = useState([])
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
        <div className="bx--row">
          { result.error &&
            <InlineNotification
              caption={result.error.message}
              hideCloseButton={true}
              kind="error"
              lowContrast
              notificationType="toast"
              role="alert"
              style={{
                marginBottom: '.5rem',
                minWidth: '30rem'
              }}
              subtitle="The Director UI cannot communicate with the server or the server encountered an error. Please check your network connection then contact your system administrator."
              timeout={0}
              title="GraphQL Error"
            />
          }
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
                onChange={(dd) => { setNewStack({ ...newStack, device: dd.selectedItem }) }}
                titleText="Action Device"
              />
            </div>
          }
          { !newStack.device &&
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
          { newStack.device && newStack.device.id !== '0' &&
            <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
              <Dropdown
                ariaLabel="Dropdown"
                id="newDeviceProvider"
                label='Required'
                items={result.data.getProviders.find(item => item.id === newStack.device.provider).providerFunctions}
                itemToString={item => (item ? item.label : '')}
                // label="Provider"
                onChange={(func) => { setNewStackItem({ ...newStackItem, function: func.selectedItem }) }}
                titleText="Action Function"
              />
            </div>
          }
          {/* TODO: Proper validation */}
          { !newStack.function &&
            <Button disabled onClick={() => { }} style={{ height: '40px', marginTop: '24px', marginRight: '16px' }} size='small' kind="primary">
            Add Action
            </Button>
          }
          { newStack.function && newStack.device.id !== '0' &&
            <Button onClick={() => { }} style={{ height: '40px', marginTop: '24px', marginRight: '16px' }} size='small' kind="primary">
            Add Action
            </Button>
          }
        </div><br/>
        { newStack.function && newStack.function.parameters &&
          newStack.function.parameters.map((parameter, index) => {
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
                        onChange={(e) => { setStackActions({ ...stackActions, [parameter.id]: e.target.value }) }}
                      />
                    </div>
                  }
                </div><br/>
              </div>
            )
          })
        }
        <br/>
        <Button onClick={() => { }} size='default' kind="primary">
          Submit
        </Button>
        <br/><br/>
        {JSON.stringify(newStack)}
      </div>
    </div>
  )
}

export default NewStack
