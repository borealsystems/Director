import React, { useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Dropdown, TextInput, InlineLoading } from 'carbon-components-react'
import omit from 'lodash/omit'
import GraphQLError from '../../components/GraphQLError.jsx'

const NewDevice = (props) => {
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

  const newDeviceMutationGQL = `mutation newDevice($newDevice: newDevice) {
    newDevice(device: $newDevice) {
      id
    }
  }`

  var [newDeviceMutationResult, newDeviceMutation] = useMutation(newDeviceMutationGQL)

  const submitNewDevice = () => {
    console.log('submitting new device')
    const conf = []
    for (var key of Object.keys(configuration)) {
      conf.push({
        id: `${key}`,
        value: configuration[key]
      })
    }
    newDevice.configuration = conf
    newDeviceMutation({ newDevice: { ...omit(newDevice, '__typename'), provider: { id: newDevice.provider.id } } }).then(console.log(newDeviceMutationResult))
    // eslint-disable-next-line react/prop-types
    props.visability(false)
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
              onChange={(e) => { setNewDevice({ ...newDevice, label: e.target.value }) }}
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
            <GraphQLError error={result.error.message} />
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
        <br/><br/>
      </div>
    </div>
  )
}

export default NewDevice
