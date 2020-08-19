import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, TextInput, Checkbox } from 'carbon-components-react'
import { useMutation } from 'urql'
import { omit } from 'lodash'

const deleteDeviceGQL = `
  mutation deleteDevice($idToDelete: String!) {
    deleteDevice(id: $idToDelete)
  }
`

const deviceUpdateMutationGQL = `mutation updateDevice($device: deviceUpdate) {
  updateDevice(device: $device) {
    id
  }
}`

const Device = (props) => {
  const initialDevice = props.new ? {} : { ...props.devices[props.index] }
  const initialConfiguration = {}
  if (!props.new && initialDevice.configuration) {
    initialDevice.configuration.forEach(item => {
      initialConfiguration[item.id] = item
    })
  }

  var [device, setDevice] = useState(omit(initialDevice, 'configuration'))
  var [configuration, setConfiguration] = useState(initialConfiguration)

  const [deleteDeviceMutationResult, deleteDeviceMutation] = useMutation(deleteDeviceGQL)
  const [deviceUpdateMutationResult, deviceUpdateMutation] = useMutation(deviceUpdateMutationGQL)

  const getProvider = (providerID) => {
    return props.providers.find(provider => provider.id === providerID)
  }

  const updateDevice = () => {
    console.log('submitting new device')
    const conf = []
    for (var key of Object.keys(configuration)) {
      conf.push(configuration[key])
    }
    const deviceUpdateObject = { device: { ...device, configuration: conf, provider: { id: device.provider.id, label: device.provider.label }, enabled: false, status: 'error' } }
    console.log(JSON.stringify(deviceUpdateObject))
    deviceUpdateMutation(deviceUpdateObject).then(console.log(deviceUpdateMutationResult))
    if (props.visability) {
      props.visability(false)
    }
  }

  if (props.deviceID === '0') {
    return (
      <>Internal Device Has No Configuration Options</>
    )
  } else {
    return (
      <div className="bx--col-lg-10">
        <div className="bx--grid">
          { props.new &&
            <div className="bx--row">
              <h3 style={{
                margin: '1vh 0 2vh 1vw'
              }}> New Device</h3>
            </div>
          }
          { !props.new &&
            <div className="bx--row">
              <h3 style={{
                margin: '1vh 0 2vh 1vw'
              }}> {device.label}</h3>
            </div>
          }
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newDeviceName'
                placeholder='Required'
                value={device.label}
                labelText='Device Name'
                onClick={() => {}}
                onChange={(e) => { setDevice({ ...device, label: e.target.value }) }}
              />
            </div>
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newDeviceLocation'
                placeholder='Optional'
                value={device.location || undefined}
                labelText='Device Location'
                onClick={() => {}}
                onChange={(e) => { setDevice({ ...device, location: e.target.value }) }}
              />
            </div>
          </div><br/>
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col bx--col-lg-4">
              <TextInput
                type='text'
                id='newDeviceDescription'
                placeholder='Optional'
                value={device.description || undefined}
                labelText='Device Description'
                onClick={() => {}}
                onChange={(e) => { setDevice({ ...device, description: e.target.value }) }}
              />
            </div>
          </div>
          <br/>
          <h4>Configuration</h4>
          <br/>
          <div className='bx-row'>
            <div className="bx--text-input__field-wrapper">
              {JSON.stringify(device)}
              <Checkbox
                labelText='Enable Device'
                id="deviceEnabledCheckbox"
                value={device.enabled}
                onChange={value => {
                  console.log(device)
                  setDevice({ ...device, enabled: value })
                }}
              />
            </div><br/>
          </div>
          { !props.new &&
            <div className='bx-row'>
              <Dropdown
                ariaLabel="Dropdown"
                id="newDeviceProvider"
                label='Provider'
                items={[device.provider]}
                selectedItem={device.provider}
                disabled
                onChange={(provider) => {}}
                titleText="Device Provider"
              />
            </div>
          }
          { props.new &&
            <div className="bx--row">
              <div className="bx--dropdown__field-wrapper bx--col bx--col-lg-4">
                <Dropdown
                  ariaLabel="Dropdown"
                  id="newDeviceProvider"
                  label='Required'
                  items={props.providers.filter(provider => provider.id !== 'internal')}
                  selectedItem={device.provider}
                  onChange={(provider) => { console.log(provider.selectedItem); setDevice({ ...device, provider: provider.selectedItem }) }}
                  titleText="Device Provider"
                />
              </div>
            </div>
          }
          <br/>
          { props.new && device.provider && getProvider(device.provider.id).parameters.map((item) =>
            <div key={item.id} className='bx-row'>
              <div className="bx--text-input__field-wrapper">
                <TextInput
                  type='text'
                  id={`newDeviceParameter${item.id}`}
                  placeholder={ item.required ? 'Required' : 'Optional' }
                  labelText={item.label}
                  onClick={() => {}}
                  onChange={(e) => { setConfiguration({ ...configuration, [item.id]: { id: item.id, value: e.target.value } }) }}
                />
              </div><br/>
            </div>
          )}
          {!props.new && device.provider && getProvider(device.provider.id).parameters.map((item) =>
            <div key={item.id} className='bx-row'>
              <div className="bx--text-input__field-wrapper">
                <TextInput
                  type='text'
                  id={`newDeviceParameter${item.id}`}
                  placeholder={ item.required ? 'Required' : 'Optional' }
                  labelText={item.label}
                  value={configuration[item.id] ? configuration[item.id].value : ''}
                  onClick={() => {}}
                  onChange={(e) => { setConfiguration({ ...configuration, [item.id]: { id: item.id, value: e.target.value } }) }}
                />
              </div><br/>
            </div>
          )}

          <Button onClick={() => { updateDevice() }} size='default' kind="primary">
            { !props.new && <>Update</> }
            { props.new && <>Create</> }
          </Button>
          { !props.new &&
            <Button onClick={() => deleteDeviceMutation({ idToDelete: device.id }).then(console.log(deleteDeviceMutationResult))} size='default' kind="danger">
              Delete
            </Button>
          }
          <Button onClick={() => { props.visability(false) }} size='default' kind="secondary">
              Cancel
          </Button>
          <br/>
          <br/>
        </div>
      </div>
    )
  }
}

Device.propTypes = {
  new: PropTypes.bool,
  index: PropTypes.number,
  deviceID: PropTypes.string,
  devices: PropTypes.array,
  providers: PropTypes.array
}

export default Device
