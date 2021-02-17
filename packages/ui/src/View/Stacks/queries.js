const newStackQueryGQL = `query getAll($realm: String, $core: String) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
    colour {
      id
      label
    }
    tags {
      id
      label
      colour {
        id
        label
      }
    }
    actions {
      device {
        id,
        label
        status
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
  tags(core: $core, realm: $realm) {
    id
    label
    colour {
      id
      label
    }
  }
  globalColours {
    id
    label
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
    status
    configuration {
      id
      value
    }
  }
}`

const existingStackQueryGQL = `query existingStack($id: String, $realm: String, $core: String) {
  stack(id: $id) {
    id
    label
    panelLabel
    description
    colour {
      id
      label
    }
    tags {
      id
      label
      colour {
        id
        label
      }
    }
    actions {
      delay
      device {
        id,
        label
        status
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
  tags(core: $core, realm: $realm) {
    id
    label
    colour {
      id
      label
    }
  }
  globalColours {
    id
    label
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
      placeholder
      tooltip
      required
      invalidText
      min
      max
    }
  }
}`

const stacksQueryGQL = `query getAll($realm: String, $core: String ) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
    actions {
      device {
        id
      }
    }
    tags {
      id
      label
      colour {
        id
        label
      }
    }
  }
  tags(core: $core, realm: $realm) {
    id
    label
    colour {
      id
      label
    }
  }
}`

const duplicateStackGQL = `
  mutation duplicateStack($id: String) {
    duplicateStack(id: $id)
  }
`

const deleteStackGQL = `
  mutation deleteStack($id: String) {
    deleteStack(id: $id)
  }
`

const stackUpdateMutationGQL = `
  mutation updateStack($stack: stackUpdateInputType) {
    updateStack(stack: $stack) {
      id
    }
  }`

const executeStackMutationGQL = `mutation executeStack($id: String) {
  executeStack(id: $id)
}`

export { deviceFunctionQueryGQL, existingStackQueryGQL, newStackQueryGQL, stacksQueryGQL, deleteStackGQL, stackUpdateMutationGQL, executeStackMutationGQL, duplicateStackGQL }
