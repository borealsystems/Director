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

export { controllersQueryGQL }
