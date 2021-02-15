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
          colour {
            id
            label
          }
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

const controllerUpdateSubscriptionGQL = `
    subscription controller {
      controller {
        label
        manufacturer
        model
        serial
        status
        panel {
          id
          label
          buttons {
            row
            column
            stack {
              colour {
                id
                label
              }
              id
              label
              panelLabel
              description
            }
          }
        }
        id
      }
    }`

export { updateBridgeMutationGQL, panelGQL, controllersQueryGQL, controllerUpdateSubscriptionGQL }
