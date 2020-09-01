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

const existingPanelGQL = `query panels {
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

const newPanelGQL = `query panels {
  stacks {
    id
    label
    panelLabel
    description
  }
}`

const deletePanelGQL = `
  mutation deletePanel($deleteID: String) {
    deletePanel(id: $deleteID)
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
