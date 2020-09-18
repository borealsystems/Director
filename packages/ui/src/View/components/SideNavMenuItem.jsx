import React from 'react'
import {
  useHistory,
  useRouteMatch
} from 'react-router-dom'
import { SideNavMenuItem } from 'carbon-components-react/lib/components/UIShell'

// eslint-disable-next-line react/prop-types
function NavLink ({ label, to, renderIcon }) {
  const match = useRouteMatch({ path: to, exact: true })
  const history = useHistory()
  if (match) {
    return (
      <SideNavMenuItem aria-current="page" onClick={() => { history.push(to) }}>
        {renderIcon && <renderIcon />}{label}
      </SideNavMenuItem>
    )
  } else {
    return (
      <SideNavMenuItem onClick={() => { history.push(to) }}>
        {renderIcon && <renderIcon />}{label}
      </SideNavMenuItem>
    )
  }
}

export default NavLink
