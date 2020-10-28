const stacksQueryGQL = `query getAll($realm: String, $core: String ) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
    actions {
      device {
        id,
        label
        provider {
          id
        }
      }
      providerFunction {
        id
        label
      }
      parameters {
        id
        value
      }
    }
  }
  devices(core: $core, realm: $realm) {
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

const deviceFunctionQueryGQL = `query deviceFunctions($id: String) {
  deviceFunctions(id: $id) {
    id
    label
    parameters {
      id
      label
      inputType
      regex
      items 
    }
  }
}`

export { stacksQueryGQL, deviceFunctionQueryGQL }
