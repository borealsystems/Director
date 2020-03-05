import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'carbon-components-react'
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
  return (
    <>
      {device.configuration && device.configuration.map((item, index) => {
        return (
          JSON.stringify(item)
        )
      })}
      <br/>
      { device.id !== '0' &&
        <>
          <Button onClick={() => deleteDeviceMutation({ idToDelete: device.id })} style={{ minWidth: '20%' }} size='small' kind="danger">
            Delete
          </Button>
          <Button onClick={() => { }} style={{ minWidth: '20%' }} size='small' kind="primary">
            Update
          </Button>
        </>
      }
    </>
  )
}

Device.propTypes = {
  devices: PropTypes.array,
  deviceID: PropTypes.string
}

export default Device
