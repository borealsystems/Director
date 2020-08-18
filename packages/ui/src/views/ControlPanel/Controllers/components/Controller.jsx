import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput, Dropdown } from 'carbon-components-react'
import { useMutation } from 'urql'

const deleteControllerGQL = `
  mutation deleteController($deleteID: String) {
    deleteController(id: $deleteID)
  }
`

const controllerUpdateMutationGQL = `
  mutation controller($controller: controllerInputType) {
    controller(controller: $controller) {
      id
    }
  }
`

const Controller = (props) => {
  const initialController = props.new ? {} : props.controllers.find((item) => { return item.id === props.controllerID })
  var [controller, setController] = useState(initialController)

  const [deleteControllerMutationResult, deleteControllerMutation] = useMutation(deleteControllerGQL)
  const [controllerUpdateMutationResult, controllerUpdateMutation] = useMutation(controllerUpdateMutationGQL)

  const updateController = () => {
    console.log(JSON.stringify(controller))
    controllerUpdateMutation({ controller: controller }).then(console.log(controllerUpdateMutationResult))
    if (props.visability) {
      props.visability(false)
    }
  }

  return (
    <div className="bx--col-lg-10">
      <div className="bx--grid">
        { props.new &&
          <div className="bx--row">
            <h3 style={{
              margin: '1vh 0 2vh 1vw'
            }}> New Controller</h3>
          </div>
        }
        { !props.new &&
          <div className="bx--row">
            <h3 style={{
              margin: '1vh 0 2vh 1vw'
            }}> {controller.label || 'Unnamed Controller'}</h3>
          </div>
        }
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='ControllerName'
              placeholder='Required'
              value={controller.label || 'Unnamed Controller'}
              labelText='Controller Name'
              onClick={() => {}}
              onChange={(e) => { setController({ ...controller, label: e.target.value }) }}
            />
          </div>
        </div><br/>
        <div className="bx--row">
          <div className="bx--text-input__field-wrapper bx--col">
            <TextInput
              type='text'
              id='ControllerDescription'
              placeholder='Optional'
              value={controller.description || undefined}
              labelText='Controller Description'
              onClick={() => {}}
              onChange={(e) => { setController({ ...controller, description: e.target.value }) }}
            />
          </div>
        </div><br/>
        <div className='bx-row'>
          <Dropdown
            ariaLabel="Dropdown"
            id="controllerPanel"
            label='Panel'
            items={props.panels}
            selectedItem={controller.panel}
            itemToString={item => (item ? item.label : '')}
            onChange={(panel) => { setController({ ...controller, panel: panel.selectedItem }) }}
            titleText="Controller Panel Mapping"
          />
        </div><br/>
        { controller.panel === null
          ? <Button disabled onClick={() => { }} size='default' kind="primary">
            { !props.new && <>Update</> }
            { props.new && <>Create</> }
          </Button> : <Button onClick={() => { updateController() }} size='default' kind="primary">
            { !props.new && <>Update</> }
            { props.new && <>Create</> }
          </Button>
        }
        { !props.new && controller.status !== 'online' &&
            <Button onClick={() => deleteControllerMutation({ deleteID: controller.id }).then(console.log(deleteControllerMutationResult))} size='default' kind="danger">
              Delete
            </Button>
        }
        <Button onClick={() => { props.visability(false) }} size='default' kind="secondary">
              Cancel
        </Button>
        <br/><br/>
      </div>
    </div>
  )
}

Controller.propTypes = {
  new: PropTypes.bool,
  controllerID: PropTypes.string,
  controllers: PropTypes.array,
  panels: PropTypes.array,
  visability: PropTypes.func
}

export default Controller
