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
  providers {
    id
    label
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
}`

export { stacksQueryGQL }
