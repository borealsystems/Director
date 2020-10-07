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
mutation deleteDevice($idToDelete: String!) {
  deleteDevice(id: $idToDelete)
}
`

export { devicesQueryGQL, deleteDeviceGQL }
