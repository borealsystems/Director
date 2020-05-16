import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput, ToggleSmall } from 'carbon-components-react'
import { useMutation } from 'urql'

const deleteDeviceGQL = `
  mutation deleteDevice($idToDelete: String!) {
    deleteDevice(id: $idToDelete)
  }
`

const Device = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [deleteDeviceMutationResult, deleteDeviceMutation] = useMutation(deleteDeviceGQL)
  const device = props.devices.find((item) => { return item.id === props.deviceID })
  if (device.id === '0') {
    return (
      <>Internal Device Has No Configuration Options</>
    )
  } else {
    return (
      <div className="bx--col-lg-10">
        <div className="bx--grid">
          <h3>{device.label}</h3>
          <h5>ID: {device.id}</h5>
          <br />
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newDeviceName'
                placeholder='Required'
                labelText='Device Name'
                value={device.label}
                onClick={() => {}}
                onChange={(e) => { }}
              />
            </div>
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newDeviceLocation'
                placeholder='Optional'
                labelText='Device Location'
                value={device.location}
                onClick={() => {}}
                onChange={(e) => { }}
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
                value={device.description}
                onClick={() => {}}
                onChange={(e) => { }}
              />
            </div>
          </div><br/>
          <h4>Configuration</h4>
          <div className="bx--row">
            <div className="bx--col bx--col-lg-4">
              Device State: <ToggleSmall
                aria-label='Device Status'
                labelA='Disabled'
                labelB='Enabled'
                toggled={device.enabled}
                onChange={() => {}}
                onToggle={() => {}}
                id="enableDevice"
              />
            </div>
          </div>
          { device.configuration && device.configuration.map((item) =>
            <div key={item.id} className='bx-row'>
              <div className="bx--text-input__field-wrapper">
                <TextInput
                  type='text'
                  id={`configuration${item.id}`}
                  placeholder='Optional'
                  labelText={item.id}
                  value={item.value}
                  onClick={() => {}}
                  onChange={(e) => { } }
                />
              </div><br/>
            </div>
          )}
          <div className="bx--row">
            <Button onClick={() => deleteDeviceMutation({ idToDelete: device.id })} style={{ minWidth: '20%' }} size='normal' kind="danger">
              Delete
            </Button>
            <Button onClick={() => { }} style={{ minWidth: '20%' }} size='normal' kind="primary">
              Update
            </Button>
            <Button onClick={() => { }} style={{ minWidth: '20%' }} size='normal' kind="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

Device.propTypes = {
  devices: PropTypes.array,
  deviceID: PropTypes.string
}

export default Device
