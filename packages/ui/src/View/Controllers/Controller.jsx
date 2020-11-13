import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput, ComboBox, Grid, Row, Column } from 'carbon-components-react'
import { useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import { controllerUpdateMutationGQL } from './queries'
import globalContext from '../../globalContext'

const Controller = ({ id, _controller, layouts, panels }) => {
  const isNew = id === 'new'
  const initialController = isNew ? { type: { id: 'virtual', label: 'Virtual Controller' } } : _controller
  var [controller, setController] = useState(initialController)

  const history = useHistory()
  const { contextRealm } = useContext(globalContext)

  const [, controllerUpdateMutation] = useMutation(controllerUpdateMutationGQL)

  const updateController = () => {
    controllerUpdateMutation({ controller: controller }).then(
      history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers` })
    )
  }

  return (
    <Grid>
      <Row>
        <Column>
          <h1>{ id === 'new' ? 'New Controller' : controller.label }</h1><br/>
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput
            type='text'
            id='ControllerName'
            placeholder='Required'
            value={controller.label || ''}
            labelText='Controller Name'
            onClick={() => {}}
            onChange={(e) => { setController({ ...controller, label: e.target.value }) }}
          />
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <TextInput
            type='text'
            id='ControllerDescription'
            placeholder='Optional'
            value={controller.description || ''}
            labelText='Controller Description'
            onClick={() => {}}
            onChange={(e) => { setController({ ...controller, description: e.target.value }) }}
          />
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <ComboBox
            disabled={controller.type.id !== 'virtual'}
            ariaLabel="Dropdown"
            id="controllerType"
            placeholder='Filter...'
            items={[
              { id: 'virtual', label: 'Virtual Controller' },
              { id: 'bridged', label: 'Bridged USB or Serial Controller' }
            ]}
            selectedItem={controller.type}
            onChange={(type) => { setController({ ...controller, type: type.selectedItem }) }}
            titleText="Controller Type"
          />
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <ComboBox
            ariaLabel="Dropdown"
            id="controllerType"
            placeholder='Filter...'
            disabled={!controller.type || controller.type.id !== 'virtual'}
            items={layouts}
            selectedItem={controller.layout || ''}
            itemToString={item => item ? `${item.label} (${item.columns}x${item.rows})` : ''}
            onChange={(layout) => { setController({ ...controller, layout: layout.selectedItem }) }}
            titleText="Controller Layout"
          />
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <ComboBox
            ariaLabel="Dropdown"
            id="controllerPanel"
            placeholder='Filter...'
            disabled={!controller.layout}
            items={panels}
            selectedItem={controller.panel || ''}
            onChange={(panel) => { setController({ ...controller, panel: panel.selectedItem }) }}
            titleText="Controller Panel Mapping"
          />
        </Column>
      </Row><br/><br/>
      <Row>
        <Column>
          <Button disabled={!controller.panel || !controller.label} onClick={() => { updateController() }} kind="primary" style={{ float: 'right', minWidth: '15em', maxWidth: '15em' }}>
            { !isNew && <>Update</> }
            { isNew && <>Create</> }
          </Button>
        </Column>
      </Row>
    </Grid>
  )
}

Controller.propTypes = {
  id: PropTypes.string,
  _controller: PropTypes.object,
  panels: PropTypes.array,
  layouts: PropTypes.array
}

export default Controller
