import React, { useContext } from 'react'
import { Button, SideNav, SideNavItems } from 'carbon-components-react'
import { Application24, Dashboard24, DataBase24, DeploymentPolicy24, FolderDetails24, Apps24, Rocket24, Workspace24, FunctionMath24 } from '@carbon/icons-react'
import globalContext from '../../globalContext'
import SideNavLink from './SideNavLink.jsx'
import useWindowDimensions from '../hooks/useWindowDimensions'

const SidebarNav = ({ isActive }) => {
  const { contextRealm } = useContext(globalContext)
  const { width } = useWindowDimensions();
  
  return (
    <SideNav aria-label='Side navigation' active={isActive} isRail expanded={isActive || width > 1055}>
      <SideNavItems>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/`} label='Dashboard' renderIcon={Dashboard24} />
        <br/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices`} label='Devices' renderIcon={DataBase24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks`} label='Stacks' renderIcon={FolderDetails24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels`} label='Panels' renderIcon={Application24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers`} label='Controllers' renderIcon={Apps24}/>
        <br/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/control/shotbox`} label='Shotbox' renderIcon={Workspace24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/control/executer`} label='Executer' renderIcon={FunctionMath24}/>
        <br/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/configuration`} label='Core' renderIcon={DeploymentPolicy24}/>
        <SideNavLink to={`/cores/${contextRealm.coreID}/realms`} label='Realms' renderIcon={Rocket24}/>
      </SideNavItems>
    </SideNav>
  )
}

export default SidebarNav
