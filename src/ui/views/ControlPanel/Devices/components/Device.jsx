import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput, Toggle } from 'carbon-components-react'
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
          <h4>Details</h4>
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newDeviceName'
                placeholder='Required'
                labelText='Device Name'
                value={device.name}
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
            <p>Device Status:&nbsp;</p>
            <Toggle
              labelA='Disabled'
              labelB='Enabled'
              toggled={device.enabled}
              onChange={() => {}}
              onToggle={() => {}}
              id="enableDevice"
            />
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
            <Button onClick={() => deleteDeviceMutation({ idToDelete: device.id })} style={{ minWidth: '20%' }} size='small' kind="danger">
              Delete
            </Button>
            <Button onClick={() => { }} style={{ minWidth: '20%' }} size='small' kind="primary">
              Update
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
