import React from 'react'
import {
  useRouteMatch,
  useHistory
} from 'react-router-dom'
import { SideNavLink } from 'carbon-components-react/lib/components/UIShell'

function CustomSideNavLink ({ label, to, renderIcon }) {
  const match = useRouteMatch({ path: to, exact: true })
  const history = useHistory()
  if (match) {
    return (
      <SideNavLink large aria-current='page' renderIcon={renderIcon} onClick={() => { history.push(to) }}>
        {label}
      </SideNavLink>
    )
  } else {
    return (
      <SideNavLink large renderIcon={renderIcon} onClick={() => { history.push(to) }}>
        {label}
      </SideNavLink>
    )
  }
}

export default CustomSideNavLink
