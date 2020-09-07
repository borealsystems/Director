import React from 'react'

import Logs from './Logs.jsx'
import Status from './Status.jsx'
import ResourceSummary from './ResourceSummary.jsx'
import SystemNotes from './SystemNotes.jsx'

import { Grid, Row, Column, Tile, Link } from 'carbon-components-react'
import { Popup16 } from '@carbon/icons-react'

const Dashboard = () => {
  const tileHeight = '415px'
  return (
    <Grid style={{ maxWidth: '200rem' }}>
      <Row>
        <Column>
          {/* <h2>Dashboard</h2> */}
        </Column>
      </Row><br/>
      <Row>
        <Column lg={{ span: 6 }}>
          <Tile style={{ height: tileHeight }}>
            <h5>System Information</h5><br/>
            <SystemNotes />
          </Tile>
        </Column>
        <Column>
          <Tile style={{ height: tileHeight }}>
            <h5>Quick Links</h5><br/>
            <p>
                You can configure your quick links on your user profile that doesn&apos;t exist yet. <Link href='https://phabricator.boreal.systems/T7'>T7.</Link>
            </p>
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
          <Tile style={{ height: tileHeight, overflowY: 'scroll' }}>
            <h5>Logs <Popup16 onClick={ () => { }} style={{ float: 'right' }} /></h5> {/* TODO: Make Modal */}
            <br />
            <Logs />
          </Tile>
        </Column>
        <Column>
          <Tile style={{ height: tileHeight }}>
            <h5>About Director</h5><br/>
            <p>
                Director is a FOSS project from <Link href='https://boreal.system'>BorealSystems</Link>.
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
