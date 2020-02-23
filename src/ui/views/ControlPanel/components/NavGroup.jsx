import React from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import { SideNavMenu } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function NavGroup ({ icon, label, grouppath, children }) {
  const match = useRouteMatch(grouppath)
  if (match) {
    return (
      <SideNavMenu renderIcon={icon} title={label} defaultExpanded={true}>
        {children}
      </SideNavMenu>
    )
  } else {
    return (
      <SideNavMenu renderIcon={icon} title={label}>
        {children}
      </SideNavMenu>
    )
  }
}

export default NavGroup
