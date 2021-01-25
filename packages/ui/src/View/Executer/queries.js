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

const executeActionMutationGQL = `
  mutation executeAction($action: stackActionInputType) {
    executeAction(action: $action)
  }`

export { devicesQueryGQL, deviceFunctionQueryGQL, executeActionMutationGQL }
