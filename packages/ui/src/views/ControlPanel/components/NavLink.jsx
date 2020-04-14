import React from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import { SideNavMenuItem } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function NavLink ({ label, to }) {
  const match = useRouteMatch(to)
  if (match) {
    return (
      <SideNavMenuItem href={to} aria-current="page">
        {label}
      </SideNavMenuItem>
    )
  } else {
    return (
      <SideNavMenuItem href={to}>
        {label}
      </SideNavMenuItem>
    )
  }
}

export default NavLink
