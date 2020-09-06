import React from 'react'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'
import { SideNavLink } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function CustomSideNavLink ({ label, to, renderIcon }) {
  const match = useRouteMatch(to)
  if (match) {
    return (
      <Link style={{ textDecoration: 'none' }} to={to}>
        <SideNavLink aria-current='page' renderIcon={renderIcon}>
          {label}
        </SideNavLink>
      </Link>
    )
  } else {
    return (
      <Link style={{ textDecoration: 'none' }} to={to}>
        <SideNavLink renderIcon={renderIcon}>
          {label}
        </SideNavLink>
      </Link>
    )
  }
}

export default CustomSideNavLink
