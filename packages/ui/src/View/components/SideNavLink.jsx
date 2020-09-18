import React from 'react'
import {
  useRouteMatch,
  useHistory
} from 'react-router-dom'
import { SideNavLink } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function CustomSideNavLink ({ label, to, renderIcon }) {
  const match = useRouteMatch({ path: to, exact: true })
  const history = useHistory()
  if (match) {
    return (
      <SideNavLink aria-current='page' renderIcon={renderIcon} onClick={() => { history.push(to) }}>
        {label}
      </SideNavLink>
    )
  } else {
    return (
      <SideNavLink renderIcon={renderIcon} onClick={() => { history.push(to) }}>
        {label}
      </SideNavLink>
    )
  }
}

export default CustomSideNavLink
