import React from 'react'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'
import { SideNavMenuItem } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function NavLink ({ label, to, icon }) {
  const match = useRouteMatch(to)
  if (match) {
    return (
      <Link style={{ textDecoration: 'none' }} to={to}>
        <SideNavMenuItem aria-current="page" renderIcon={icon}>
          {label}
        </SideNavMenuItem>
      </Link>
    )
  } else {
    return (
      <Link style={{ textDecoration: 'none' }} to={to}>
        <SideNavMenuItem renderIcon={icon}>
          {label}
        </SideNavMenuItem>
      </Link>
    )
  }
}

export default NavLink
