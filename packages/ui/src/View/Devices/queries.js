const devicesQueryGQL = `query devices($realm: String, $core: String) {
  devices(realm: $realm, core: $core) {
    id
    label
    location
    description
    provider {
      id
      label
    }
    status
  }
}`

const deleteDeviceGQL = `
mutation deleteDevice($id: String!) {
  deleteDevice(id: $id)
}
`

const newDeviceQuery = `
query providers {
  providers {
    id
    label
    manufacturer
    protocol
    description
    category
    parameters {
      inputType
      required
      id
      label
      regex
      placeholder
      tooltip
      items
    }
    defaults
  }
}
`

const existingDeviceQuery = `
query deviceAndProviders($id: String) {
  providers {
    id
    label
  }
  device(id:$id){
    id
    label
    location
    description
    status 
    configuration {
      id
      value
    }
    provider {
      id
      label
      manufacturer
      protocol
      description
      category
      parameters {
        inputType
        required
        id
        label
        regex
        placeholder
        tooltip
        items
      }
      defaults
    }
  }
}
`

const deviceMutationGQL = `mutation device($device: deviceUpdate) {
  device(device: $device) {
    id
  }
}`

const enableDeviceMutationGQL = `mutation enableDevice($id: String) {
  enableDevice(id:$id)
}`

const disableDeviceMutationGQL = `mutation disableDevice($id: String) {
  disableDevice(id:$id)
}`

export { devicesQueryGQL, deleteDeviceGQL, newDeviceQuery, existingDeviceQuery, deviceMutationGQL, enableDeviceMutationGQL, disableDeviceMutationGQL }
