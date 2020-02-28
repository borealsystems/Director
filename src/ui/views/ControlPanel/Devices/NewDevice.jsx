import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Dropdown, TextInput, InlineLoading, InlineNotification } from 'carbon-components-react'

const NewDevice = () => {
  const [newDevice, setNewDevice] = useState({})
  const [configuration, setConfiguration] = useState({})
  const [result] = useQuery({
    query: `query getProviders {
      getProviders {
        id
        label
        protocol
        parameters {
          required
          id
          label
          regex
        }
      }
    }`
  })

  var [newDeviceMutationResult, newDeviceMutation] = useMutation({
    mutation: `mutation newDevice($name: String!, $location: String, $description: String, $provider: String, $configuration) {
      newDevice(name: $name, definition: $definition, config: $config)
    }`
  })

  const submitNewDevice = () => {
    console.log('submitting new device')
    const conf = []
    for (var key of Object.keys(configuration)) {
      conf.push({
        id: key,
        value: configuration[key]
      })
    }
    newDevice.configuration = conf
    newDeviceMutation(newDevice)
    console.log(newDeviceMutationResult)
  }

  return (
    <div className="bx--col-lg-10">
      <div className="bx--grid">
        <div className="bx--row">
          <h3 style={{
            margin: '1vh 0 2vh 1vw'
          }}> New Device</h3>
        </div>
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='newDeviceName'
              placeholder='Required'
              labelText='Device Name'
              onClick={() => {}}
              onChange={(e) => { setNewDevice({ ...newDevice, name: e.target.value }) }}
            />
          </div>
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='newDeviceLocation'
              placeholder='Optional'
              labelText='Device Location'
              onClick={() => {}}
              onChange={(e) => { setNewDevice({ ...newDevice, location: e.target.value }) }}
            />
          </div>
        </div><br/>
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col bx--col-lg-4">
            <TextInput
              type='text'
              id='newDeviceDescription'
              placeholder='Optional'
              labelText='Device Description'
              onClick={() => {}}
              onChange={(e) => { setNewDevice({ ...newDevice, description: e.target.value }) }}
            />
          </div>
        </div><br/>
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
                items={result.data.getProviders}
                itemToString={item => (item ? item.label : '')}
                // label="Provider"
                onChange={(provider) => { setNewDevice({ ...newDevice, provider: provider.selectedItem }) }}
                titleText="Device Provider"
              />
            </div>
          }
        </div> <br/>
        { newDevice.provider && newDevice.provider.parameters.map((item) =>
          <div key={item.id} className='bx-row'>
            <div className="bx--text-input__field-wrapper">
              { item.required &&
                <TextInput
                  type='text'
                  id={`newDeviceParameter${item.id}`}
                  placeholder='Required'
                  labelText={item.label}
                  onClick={() => {}}
                  onChange={(e) => { setConfiguration({ ...configuration, [item.id]: e.target.value }) }}
                />
              }
              { !item.required &&
                <TextInput
                  type='text'
                  id={`newDeviceParameter${item.id}`}
                  placeholder='Optional'
                  labelText={item.label}
                  onClick={() => {}}
                  onChange={(e) => { setConfiguration({ ...configuration, [item.id]: e.target.value }) }}
                />
              }
            </div><br/>
          </div>
        )}
        <Button onClick={() => { submitNewDevice() }} size='default' kind="primary">
          Submit
        </Button>
        <br/>
        { JSON.stringify(newDevice) }
        <br/><br/>
      </div>
    </div>
  )
}

export default NewDevice
