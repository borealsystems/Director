import React, { useContext } from 'react'
import globalContext from '../../globalContext'

import Logs from './Logs.jsx'
import Status from './Status.jsx'
import ResourceSummary from './ResourceSummary.jsx'
import Notes from './Notes.jsx'

import { Grid, Row, Column, Tile, Link } from 'carbon-components-react'

const Dashboard = () => {
  const { contextRealm } = useContext(globalContext)
  const tileHeight = '415px'
  return (
    <Grid style={{ maxWidth: '200rem' }}>
      <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
      <Row>
        <Column lg={{ span: 6 }}>
          <Tile style={{ height: tileHeight }}>
            <Notes />
          </Tile>
        </Column>
        <Column>
          <Tile style={{ height: tileHeight }}>
            <h5>Quick Links</h5><br/>
            <ul>
              <li>
                <Link href={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices/new`}>New Device</Link>
              </li>
              <li>
                <Link href={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks/new`}>New Stack</Link>
              </li>
              <li>
                <Link href={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels/new`}>New Panel</Link>
              </li>
              <li>
                <Link href={`/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers/new`}>New Virtual Controller</Link>
              </li>
            </ul>
          </Tile>
        </Column>
        <Column>
          <Tile style={{ height: tileHeight }}>
            <h5>Resource summary</h5>
            <ResourceSummary/>
          </Tile>
        </Column>
      </Row>
      <span style={{ display: 'inline-block', height: '2rem' }}>&nbsp;</span>
      <Row>
        <Column>
          <Tile style={{ height: tileHeight }}>
            <h5>System Status</h5>
            <Status />
          </Tile>
        </Column>
        <Column lg={{ span: 6 }}>
          <Tile style={{ height: tileHeight, overflow: 'hidden' }}>
            <Logs />
          </Tile>
        </Column>
        <Column>
          <Tile style={{ height: tileHeight }}>
            <h5>About Director</h5><br/>
            <p>
                Director is a FOSS project from <Link href='https://boreal.systems'>BorealSystems</Link>.
              <br/><br/> We are very greatful for everyones support during ongoing development, in particular we would like to thank our contributers,
                both <Link href='https://phabricator.boreal.systems/project/members/1/'>Code/Design</Link> and <Link href='https://www.patreon.com/borealsystems?fan_landing=true'>Financial</Link>,
                as well as everyone on the Video Engineering Discord who provided much needed beta testing and motivation.
              <br/><br/> If you find any bugs or would like to request features/devices you can do so on our <Link href='https://phabricator.boreal.systems'>Phabricator</Link>.
              <br/><br/> Thank you for using Director.
            </p>
          </Tile>
        </Column>
      </Row>
    </Grid>
  )
}

export default Dashboard
