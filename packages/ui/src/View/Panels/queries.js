const panelsGQL = `query panels {
  stacks {
    id
    label
    panelLabel
    description
  }
  panels {
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
}`

const existingPanelGQL = `query panel($id: String) {
  stacks {
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
}`

const newPanelGQL = `query panels {
  stacks {
    id
    label
    panelLabel
    description
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
