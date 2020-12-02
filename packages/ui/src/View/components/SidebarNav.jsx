import React, { useState, useContext } from 'react'
import { Button, SideNav, SideNavItems } from 'carbon-components-react'
import { Application24, Dashboard24, DataBase24, DeploymentPolicy24, FolderDetails24, Pin24, ResearchHintonPlot24, Rocket24, Workspace24 } from '@carbon/icons-react'
import globalContext from '../../globalContext'
import SideNavLink from './SideNavLink.jsx'

const SidebarNav = () => {
  const { contextRealm } = useContext(globalContext)
  const [sidebarPinned, setSidebarPinned] = useState(JSON.parse(localStorage.getItem('SidebarNavPinned')))

  const sidebarPinHandler = () => {
    setSidebarPinned(!sidebarPinned)
    localStorage.setItem('SidebarNavPinned', !sidebarPinned)
  }

  return (
    <SideNav aria-label='Side navigation' active={true} isRail expanded={sidebarPinned}>
      <SideNavItems>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/`} label='Dashboard' renderIcon={Dashboard24} />
        <br/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices`} label='Devices' renderIcon={DataBase24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks`} label='Stacks' renderIcon={FolderDetails24}/>
        {/* eslint-disable-next-line camelcase */}
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels`} label='Panels' renderIcon={Application24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers`} label='Controllers' renderIcon={ResearchHintonPlot24}/>
        <br/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/control/shotbox`} label='Shotbox' renderIcon={Workspace24}/>
        <br/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/configuration`} label='Core' renderIcon={DeploymentPolicy24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms`} label='Realms' renderIcon={Rocket24}/>
        <Button
          renderIcon={Pin24}
          hasIconOnly
          kind='secondary'
          onClick={sidebarPinHandler}
          tooltipPosition='right'
          iconDescription={sidebarPinned ? 'Unpin Sidebar' : 'Pin Open'}
          style={{ width: '48px', position: 'fixed', bottom: 0 }}
        />
      </SideNavItems>
    </SideNav>
  )
}

export default SidebarNav
