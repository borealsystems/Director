import React from 'react'
import PropTypes from 'prop-types'

import { useHistory } from 'react-router-dom'

import {
  ComboBox,
  Grid,
  Row,
  Column
} from 'carbon-components-react'

import lost from './lost.svg'

const Landing = ({ realms, realm, setRealm }) => {
  const history = useHistory()
  // if (realm.core) history.push(`/${realm.core.id}/${realm.realm.id}/`)
  return (
    <Grid>
      <Row>
        <Column sm={{ span: 1 }}>
          <br/><br/><br/>
          <Row>
            <h2>Lost?</h2>
          </Row><br/>
          { realms.length === 0 &&
            <Row>
              <h4>It looks like you can&apos;t find any realms</h4>
            </Row>
          }
          { realms.length !== 0 &&
            <Row>
              <ComboBox
                className='comboBoxNoClear'
                style={{ width: '25em' }}
                ariaLabel='realmDropdown'
                id='Realm'
                label='Realm'
                titleText='Return to familiar territory'
                placeholder='Core / Realm'
                selectedItem=''
                items={realms}
                itemToString={(item) => { return item.id === 'ROOT' ? item.coreLabel : `${item.coreLabel} / ${item.label}` }}
                onChange={(event) => {
                  setRealm(event.selectedItem)
                  history.push(`/cores/${event.selectedItem.coreID}/realms/${event.selectedItem.id}/`)
                }}
              />
            </Row>
          }
          <br/>
          <Row>
            If you arrived here by a broken link, please submit a bug report.
          </Row><br/>
        </Column>
        <Column>
          <img src={lost} width='60%' style={{ marginLeft: '25%', marginTop: '10%' }}/>
        </Column>
      </Row>
    </Grid>
  )
}

Landing.propTypes = {
  realms: PropTypes.array,
  realm: PropTypes.object,
  setRealm: PropTypes.func
}

export default Landing
