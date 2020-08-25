const newDeviceQuery = `
query providers {
  providers {
    id
    label
    protocol
    parameters {
      required
      id
      label
      regex
    }
    providerFunctions {
      id
      label
      parameters {
        id
        label
        inputType
        regex
      }
    }
  }
}
`

const existingDeviceQuery = `
query deviceAndProviders($id: String) {
  providers {
    id
    label
    protocol
    parameters {
      required
      id
      label
      regex
    }
    providerFunctions {
      id
      label
      parameters {
        id
        label
        inputType
        regex
      }
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

const deviceUpdateMutationGQL = `mutation updateDevice($device: deviceUpdate) {
  updateDevice(device: $device) {
    id
  }
}`

export { newDeviceQuery, existingDeviceQuery, deviceUpdateMutationGQL }
