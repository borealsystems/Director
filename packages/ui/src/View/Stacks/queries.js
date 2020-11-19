const newStackQueryGQL = `query getAll($realm: String, $core: String ) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
    actions {
      device {
        id,
        label
        enabled
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

const existingStackQueryGQL = `query existingStack($id: String, $realm: String, $core: String) {
  stack(id: $id) {
    id
    label
    panelLabel
    description
    actions {
      device {
        id,
        label
        enabled
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
