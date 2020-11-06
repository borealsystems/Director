import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { AccordionItem, Accordion, Button, TextInput, Grid, Row, Column, ButtonSet } from 'carbon-components-react'
import { useMutation } from 'urql'
import { omit } from 'lodash'
import { useHistory } from 'react-router-dom'
import globalContext from '../../globalContext'
import Action from './Action.jsx'
import { executeStackMutationGQL, stackUpdateMutationGQL } from './queries'
import { Add24, ArrowDown16, ArrowUp16 } from '@carbon/icons-react'

// TODO: fix the autosaving action parameter details, it currently updates and rerenders which removes to input focus from the client, making long paths hard to type in

const Stack = ({ id, _stack, providers, devices }) => {
  const isNew = id === 'new'
  const { contextRealm } = useContext(globalContext)
  const initialStack = id === 'new' ? {} : _stack
  const initialActions = id === 'new' ? [] : _stack.actions
  if (id !== 'new' && initialStack.actions) {
    initialStack.actions.forEach(item => {
      initialActions[item.id] = item
    })
  }

  const [stack, setStack] = useState(initialStack)
  const [actions, setActions] = useState(initialActions)
  const [newActionVisibility, setNewActionVisibility] = useState(isNew)

  const [, executeStackMutation] = useMutation(executeStackMutationGQL)
  const [, stackUpdateMutation] = useMutation(stackUpdateMutationGQL)

  const history = useHistory()

  const submitButtonStyles = { minWidth: '15em', maxWidth: '15em' }
  const buttonStyles = { ...submitButtonStyles, visibility: isNew ? 'hidden' : 'visible' }

  const updatestack = () => {
    var actionsStripped = []
    actions.forEach(action => {
      actionsStripped.push({ ...action, device: { id: action.device.id, label: action.device.label, provider: { id: action.device.provider.id } }, providerFunction: { id: action.providerFunction.id, label: action.providerFunction.label }, parameters: action.parameters })
    })
    const stackUpdateObject = { stack: { ...stack, actions: actionsStripped, realm: contextRealm.id, core: contextRealm.coreID } }
    stackUpdateMutation(stackUpdateObject).then(history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks` }))
  }

  const duplicateStack = () => {
    var actionsStripped = []
    actions.forEach(action => {
      actionsStripped.push({ ...action, device: { id: action.device.id, label: action.device.label, provider: { id: action.device.provider.id } }, providerFunction: { id: action.providerFunction.id, label: action.providerFunction.label }, parameters: action.parameters })
    })
    const stackUpdateObject = { stack: { ...omit(stack, 'id'), label: `Duplicate of ${stack.label}`, actions: actionsStripped, realm: contextRealm.id, core: contextRealm.coreID } }
    stackUpdateMutation(stackUpdateObject)
  }

  const setActionsProxy = (action, index) => {
    const actionsArray = actions
    if (index === -1) {
      actionsArray.push(action)
    } else {
      actionsArray[index] = action
    }
    setActions(actionsArray)
    setNewActionVisibility(false)
  }

  const arrayMove = (array, from, to) => {
    array = array.slice()
    const startIndex = to < 0 ? array.length + to : to
    const item = array.splice(from, 1)[0]
    array.splice(startIndex, 0, item)
    return array
  }

  const getActionMoveButtons = (index) => {
    if (actions.length === 1) {
      return (
        <>
          <div>
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} size='small' kind="ghost">
              <ArrowUp16 />
            </Button>
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index + 1)) }} size='small' kind="ghost">
              <ArrowDown16 />
            </Button>
          </div>
          <br/>
        </>
      )
    } else if (index === 0) {
      return (
        <>
          <div>
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} size='small' kind="ghost">
              <ArrowUp16 />
            </Button>
            <Button onClick={() => {
              const mutatedActionArray = arrayMove(actions, index, index + 1)
              setActions(mutatedActionArray)
            }} size='small' kind="ghost">
              <ArrowDown16 />
            </Button>
          </div>
          <br/>
        </>
      )
    } else if (index > 0 && index < actions.length - 1) {
      return (
        <>
          <div>
            <Button onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} size='small' kind="ghost">
              <ArrowUp16 />
            </Button>
            <Button onClick={() => { setActions(arrayMove(actions, index, index + 1)) }} size='small' kind="ghost">
              <ArrowDown16 />
            </Button>
          </div>
          <br/>
        </>
      )
    } else if (index === actions.length - 1) {
      return (
        <>
          <div>
            <Button onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} size='small' kind="ghost">
              <ArrowUp16 />
            </Button>
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index + 1)) }} size='small' kind="ghost">
              <ArrowDown16 />
            </Button>
          </div>
          <br/>
        </>
      )
    }
  }

  const deleteAction = index => {
    const actionsArray = [...actions]
    actionsArray.splice(index, 1)
    setActions(actionsArray)
  }

  return (
    <Grid>
      <Row>
        <Column>
          <h3>
            {isNew ? 'New Stack' : stack.label}
          </h3>
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <TextInput
            type='text'
            id='newstackName'
            placeholder='Required'
            value={stack.label}
            labelText='Stack Name'
            onClick={() => {}}
            onChange={(e) => { setStack({ ...stack, label: e.target.value }) }}
          />
        </Column>
        <Column>
          <TextInput
            type='text'
            id='newstackName'
            placeholder='Optional'
            value={stack.panelLabel}
            labelText='Stack Panel Label'
            onClick={() => {}}
            onChange={(e) => { setStack({ ...stack, panelLabel: e.target.value }) }}
          />
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <TextInput
            type='text'
            id='newstackDescription'
            placeholder='Optional'
            value={stack.description || undefined}
            labelText='Stack Description'
            onClick={() => {}}
            onChange={(e) => { setStack({ ...stack, description: e.target.value }) }}
          />
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <h4>Stack Actions</h4>
        </Column>
      </Row><br/>
      <Row>
        <Column>
          <Accordion>
            { actions && actions.map((item, index) =>
              <Row key={index}>
                <Column style={{ maxWidth: '7.2em', paddingRight: 0, marginTop: '0.5em' }}>
                  { getActionMoveButtons(index) }
                </Column>
                <Column style={{ paddingLeft: 0 }}>
                  <AccordionItem title={`Action ${index + 1}: ${item.providerFunction.label} on ${item.device.label}`} key={JSON.stringify(item)}>
                    <Action index={index} action={item} delete={deleteAction} setActions={setActionsProxy} providers={providers} devices={devices}></Action>
                  </AccordionItem>
                </Column>
              </Row>
            )}
            <Button renderIcon={Add24} size='small' style={{ marginLeft: '7em', visibility: newActionVisibility ? 'hidden' : 'visible', height: newActionVisibility ? '0' : '', minHeight: newActionVisibility ? '0' : '' }} onClick={() => { setNewActionVisibility(true) }}>
              Add {actions.length === 0 ? 'An' : 'Another'} Action
            </Button>
          </Accordion>
          { newActionVisibility &&
            <div style={{ marginLeft: '7.2em', marginRight: '1em' }}>
              New Action<br/>
              <Action new index={actions.length + 1} delete={deleteAction} setActions={setActionsProxy} providers={providers} devices={devices}></Action>
            </div>
          }
          <br/>
        </Column>
      </Row>
      <Row>
        <Column>
          <div style={{ float: 'right' }}>
            <ButtonSet style={{ marginRight: '1px', float: 'left' }}>
              <Button disabled={isNew} onClick={() => executeStackMutation({ id: stack.id }) } kind="secondary" style={buttonStyles}>
                Execute
              </Button>
            </ButtonSet>
            <ButtonSet>
              <Button disabled={isNew} onClick={() => duplicateStack() } kind="secondary" style={buttonStyles}>
                Duplicate
              </Button>
              <Button disabled={actions.length === 0} onClick={() => { updatestack() }} kind="primary" style={submitButtonStyles}>
                { !isNew && <>Update</> }
                { isNew && <>Create</> }
              </Button>
            </ButtonSet>
          </div>
        </Column>
      </Row>
    </Grid>
  )
}

Stack.propTypes = {
  id: PropTypes.string,
  _stack: PropTypes.object,
  providers: PropTypes.array,
  devices: PropTypes.array
}

export default Stack
