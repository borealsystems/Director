const panelsGQL = `query panels($realm: String, $core: String) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
  }
  panels(core: $core, realm: $realm) {
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
  controllerLayouts {
    id
    label
    rows
    columns
  }
}`

const existingPanelGQL = `query panel($id: String, $realm: String, $core: String) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
  }
  panel(id: $id) {
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
  controllerLayouts {
    id
    label
    rows
    columns
  }
}`

const newPanelGQL = `query panels($realm: String, $core: String) {
  stacks(core: $core, realm: $realm) {
    id
    label
    panelLabel
    description
  }
  controllerLayouts {
    id
    label
    rows
    columns
  }
}`

const deletePanelGQL = `
  mutation deletePanel($id: String) {
    deletePanel(id: $id)
  }
`

const panelUpdateMutationGQL = `
  mutation updatePanel($panel: panelUpdateInputType) {
    updatePanel(panel: $panel) {
      id
    }
  }
`

export { panelsGQL, deletePanelGQL, panelUpdateMutationGQL, existingPanelGQL, newPanelGQL }
