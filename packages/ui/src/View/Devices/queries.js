const devicesQueryGQL = `query getDevicesAndProviders($realm: String, $core: String) {
  devices(realm: $realm, core: $core) {
    id
    label
    location
    description
    provider {
      id
      label
    }
    enabled
    status
    configuration {
      id
      value
    }
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
    parameters {
      required
      id
      label
      regex
    }
  }
}
`

const existingDeviceQuery = `
query deviceAndProviders($id: String) {
  providers {
    id
    label
    parameters {
      required
      id
      label
      regex
    }
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
    }
  }
}
`

const deviceMutationGQL = `mutation device($device: deviceUpdate) {
  device(device: $device) {
    id
  }
}`

export { devicesQueryGQL, deleteDeviceGQL, newDeviceQuery, existingDeviceQuery, deviceMutationGQL }
