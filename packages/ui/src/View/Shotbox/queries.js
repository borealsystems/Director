const controllerSubscriptionGQL = `subscription controller {
  controller {
    id
    label
    layout {
      id
      label
      rows
      columns
    }
    panel {
      id
      label
    }
  }
}`

export { controllerSubscriptionGQL }
