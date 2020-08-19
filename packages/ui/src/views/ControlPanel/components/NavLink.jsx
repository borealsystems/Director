import React from 'react'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'
import { SideNavMenuItem } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function NavLink ({ label, to }) {
  const match = useRouteMatch(to)
  if (match) {
    return (
      <Link to={to}>
        <SideNavMenuItem aria-current="page">
          {label}
        </SideNavMenuItem>
      </Link>
    )
  } else {
    return (
      <Link to={to}>
        <SideNavMenuItem>
          {label}
        </SideNavMenuItem>
      </Link>
    )
  }
}

export default NavLink
