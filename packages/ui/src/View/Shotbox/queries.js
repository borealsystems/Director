const controllerSubscriptionGQL = `subscription controller {
  controller {
    label
    manufacturer
    model
    serial
    status
    panel {
      id
      label
      description
      layout {
        id
        label
        rows
        columns
      }
      layoutType {
        id
        label
      }
      buttons {
        row
        column
        stack {
          id
          label
          panelLabel
          description
          colour {
            id
          }
        }
      }
    }
    id
  }
}`

const panelQueryGQL = `query panelData($id: String) {
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
        colour {
          id
        }
      }
    }
  }
}`

export { controllerSubscriptionGQL, panelQueryGQL }
