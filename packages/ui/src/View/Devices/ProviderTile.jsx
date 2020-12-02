import { CheckmarkOutline24 } from '@carbon/icons-react'
import { AspectRatio, Column, Grid, Row, ClickableTile } from 'carbon-components-react'
import React from 'react'

const ProviderTile = ({ providerDescription, onClick, currentDevice, disabled }) => {
  const isCurrentProvider = currentDevice?.provider?.id === providerDescription.id
  const labelProps = { style: { fontWeight: 300 } }
  if (!providerDescription.isPadding) {
    return (
      <ClickableTile className={ isCurrentProvider ? 'bx--tile--is-selected' : null} disabled={disabled} handleClick={ disabled ? () => {} : () => { onClick(providerDescription) }}>
        <AspectRatio ratio='16x9'>
          <Grid style={{ marginLeft: '-1em' }}>
            <Row>
              <Column sm={3} style={{ marginLeft: '-1em' }}>
                <h5>{providerDescription.label}</h5>
              </Column>
              <Column style={{ position: 'absolute', left: '90%', width: '30px' }}>
                { isCurrentProvider && <CheckmarkOutline24/> }
              </Column>
            </Row>
            <br/>
            <Row>
              <Column style={{ marginLeft: '-1em' }}>
                {providerDescription.description}
              </Column>
            </Row>
            <Row style={{ position: 'absolute', bottom: '0', width: '100%' }}>
              <Column>
                <Row {...labelProps}>Manufacturer</Row>
                <Row>{providerDescription.manufacturer}</Row>
              </Column>
              <Column>
                <Row {...labelProps}>Protocol</Row>
                <Row>{providerDescription.protocol}</Row>
              </Column>
              <Column>
                <Row {...labelProps}>Category</Row>
                <Row>{providerDescription.category}</Row>
              </Column>
            </Row>
          </Grid>
        </AspectRatio>
      </ClickableTile>
    )
  } else return null
}

export default ProviderTile
