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
        }
      }
    }
    id
  }
}`

export { controllerSubscriptionGQL }
