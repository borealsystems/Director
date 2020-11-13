const updateBridgeMutationGQL = `
mutation updateBridge($bridge: bridgeUpdateInputType) {
  updateBridge(bridge: $bridge)
}`

const panelGQL = `
  query panel($id: String) {
    panel(id: $id) {
      id
      label
      buttons {
        row
        column
        stack {
          id
          label
          panelLabel
          description
        }
      }
    }
  }`

const controllersQueryGQL = `
query controllers {
  controllers {
    manufacturer
    model
    serial
    status
    realm
    core
    panel {
      label
      id
    }
    id
    label
  }
}`

export { updateBridgeMutationGQL, panelGQL, controllersQueryGQL }
