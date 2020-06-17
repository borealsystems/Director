import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, TextInput } from 'carbon-components-react'
import { useMutation } from 'urql'
import Action from './Action.jsx'

const deleteStackGQL = `
  mutation deleteStack($deleteID: String) {
    deleteStack(id: $deleteID)
  }
`

const stackUpdateMutationGQL = `
  mutation updateStack($stack: stackUpdateInputType) {
    updateStack(stack: $stack) {
      id
    }
  }`

// TODO: fix the autosaving action parameter details, it currently updates and rerenders which removes to input focus from the client, making long paths hard to type in

const Stack = (props) => {
  const initialStack = props.new ? {} : props.stacks.find((item) => { return item.id === props.stackID })
  const initialActions = props.new ? [] : props.stacks.find((item) => { return item.id === props.stackID }).actions
  if (!props.new && initialStack.actions) {
    initialStack.actions.forEach(item => {
      initialActions[item.id] = item
    })
  }

  var [stack, setStack] = useState(initialStack)
  var [actions, setActions] = useState(initialActions)

  const [deleteStackMutationResult, deleteStackMutation] = useMutation(deleteStackGQL)
  const [stackUpdateMutationResult, stackUpdateMutation] = useMutation(stackUpdateMutationGQL)

  const updatestack = () => {
    console.log('submitting new stack')
    var actionsStripped = []
    actions.forEach(action => {
      actionsStripped.push({ ...action, device: { id: action.device.id, label: action.device.label, provider: { id: action.device.provider.id } }, providerFunction: { id: action.providerFunction.id, label: action.providerFunction.label }, parameters: action.parameters })
    })
    const stackUpdateObject = { stack: { ...stack, actions: actionsStripped } }
    console.log(JSON.stringify(stackUpdateObject))
    stackUpdateMutation(stackUpdateObject).then(console.log(stackUpdateMutationResult))
    if (props.visability) {
      props.visability(false)
    }
  }

  const setActionsProxy = (actionsArray) => {
    setActions(actionsArray)
  }

  if (props.stackID === '0') {
    return (
      <>Internal stack Has No Configuration Options</>
    )
  } else {
    return (
      <div className="bx--col-lg-10">
        <div className="bx--grid">
          { props.new &&
            <div className="bx--row">
              <h3 style={{
                margin: '1vh 0 2vh 1vw'
              }}> New Stack</h3>
            </div>
          }
          { !props.new &&
            <div className="bx--row">
              <h3 style={{
                margin: '1vh 0 2vh 1vw'
              }}> {stack.label}</h3>
            </div>
          }
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newstackName'
                placeholder='Required'
                value={stack.label}
                labelText='Stack Name'
                onClick={() => {}}
                onChange={(e) => { setStack({ ...stack, label: e.target.value }) }}
              />
            </div>
          </div><br/>
          <div className="bx--row">
            <div className="bx--text-input__field-wrapper bx--col">
              <TextInput
                type='text'
                id='newstackDescription'
                placeholder='Optional'
                value={stack.description || undefined}
                labelText='Stack Description'
                onClick={() => {}}
                onChange={(e) => { setStack({ ...stack, description: e.target.value }) }}
              />
            </div>
          </div>
          <br/>
          <h4>Stack Actions</h4>
          <br/>
          <Action new actions={actions} setActions={setActionsProxy} providers={props.providers} devices={props.devices}></Action>
          { actions && actions.map((item, index) =>
            <Action key={JSON.stringify(item)} index={index} actions={actions} setActions={setActionsProxy} providers={props.providers} devices={props.devices}></Action>
          )}
          { actions.length === 0
            ? <Button disabled onClick={() => { updatestack() }} size='default' kind="primary">
              { !props.new && <>Update</> }
              { props.new && <>Create</> }
            </Button> : <Button onClick={() => { updatestack() }} size='default' kind="primary">
              { !props.new && <>Update</> }
              { props.new && <>Create</> }
            </Button>
          }
          { !props.new &&
            <Button onClick={() => deleteStackMutation({ deleteID: stack.id }).then(console.log(deleteStackMutationResult))} size='default' kind="danger">
              Delete
            </Button>
          }
          <Button onClick={() => { props.visability(false) }} size='default' kind="secondary">
              Cancel
          </Button>
          <br/>
        </div>
      </div>
    )
  }
}

Stack.propTypes = {
  new: PropTypes.bool,
  stackID: PropTypes.string,
  devices: PropTypes.array,
  providers: PropTypes.array,
  stacks: PropTypes.array
}

export default Stack
