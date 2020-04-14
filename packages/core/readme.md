# Boreal Systems Director Core

This package is the Core of Boreal Director, the code here consists of all main elements required to spin up a Director install. For configuration you will also need Boreal Director UI (or roll your own with the GQL API, Documentation will exist at some point before the heat death of the universe.) You will probably also want either a hardware controller or Boreal Director Shotbox to actually execute stacks.

# Developement
(From Director root)
```
yarn workspace core
yarn workspace core run dev
```

# Deployment
Don't. This is not production ready in any way whatsoever.