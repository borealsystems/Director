import { AspectRatio, Column, Grid, Row, ClickableTile } from 'carbon-components-react'
import { CheckmarkOutline24 } from '@carbon/icons-react'
import PropTypes from 'prop-types'
import React from 'react'

const DeviceTile = ({ device, onClick, selectedDevice }) => {
  const isCurrentDevice = device.id === selectedDevice?.id
  const labelProps = { style: { fontWeight: 300 } }
  if (!device.isPadding) {
    return (
      <ClickableTile className={isCurrentDevice ? 'bx--tile--is-selected' : null} handleClick={() => onClick(device)}>
        <AspectRatio ratio='16x9'>
          <Grid style={{ marginLeft: '-1em' }}>
            <Row>
              <Column sm={4} style={{ marginLeft: '-1em' }}>
                <h5>{device.label}</h5>
              </Column>
              <Column style={{ position: 'absolute', left: '87%', width: '30px' }}>
                { isCurrentDevice && <CheckmarkOutline24/> }
              </Column>
            </Row>
            <Row>
              <Column style={{ marginLeft: '-1em' }}>
                {device.id ?? 'NO ID'}
              </Column>
            </Row>
            <Row>
              <Column style={{ marginLeft: '-1em' }}>
                {device.location}
              </Column>
            </Row>
            <br/>
            <Row>
              <Column style={{ marginLeft: '-1em', height: '6em', overflow: 'auto' }}>
                {device.description}
              </Column>
            </Row>
            <Row style={{ position: 'absolute', bottom: '0', width: '100%' }}>
              <Column>
                <Row style={{ fontWeight: 300 }}>Provider</Row>
                <Row>{device.provider.label}</Row>
              </Column>
            </Row>
          </Grid>
        </AspectRatio>
      </ClickableTile>
    )
  } else return null
}

DeviceTile.propTypes = {
  device: PropTypes.object,
  selectedDevice: PropTypes.object,
  onClick: PropTypes.func
}

export default DeviceTile
