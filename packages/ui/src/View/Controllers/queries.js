const controllersQueryGQL = `query controllers($realm: String, $core: String) {
  controllers(realm: $realm, core: $core) {
    label
    manufacturer
    model
    serial
    status
    panel {
      id
      label
    }
    id
  }
  panels {
    id
    label
  }
}`

const deleteControllerMutationGQL = `mutation deleteController($id: String) {
    deleteController(id: $id)
  }
`

const controllerLayoutsQueryGQL = `query controllerLayouts {
  controllerLayouts {
    id
    label
    rows
    columns
  }
  panels {
    id
    label
  }
}`

const existingControllerQueryGQL = `query controller($id: String) {
  controller(id: $id) {
    label
    manufacturer
    description
    model
    serial
    status
    type {
      id
      label
    }
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
    id
  }
  panels {
    id
    label
  }
  controllerLayouts {
    id
    label
    rows
    columns
  }
}
`

const controllerUpdateMutationGQL = `
  mutation controller($controller: controllerInputType) {
    controller(controller: $controller) {
      id
    }
  }
`

export { controllersQueryGQL, controllerUpdateMutationGQL, deleteControllerMutationGQL, controllerLayoutsQueryGQL, existingControllerQueryGQL }
