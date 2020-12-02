import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { AccordionItem, Accordion, Button, TextInput, Grid, Row, Column, ButtonSet, InlineLoading } from 'carbon-components-react'
import { useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import globalContext from '../../globalContext'
import { stackUpdateMutationGQL } from './queries'
import { Add24, ArrowDown16, ArrowUp16, Exit24 } from '@carbon/icons-react'
import Action from './Action.jsx'
import Padding from '../components/Padding.jsx'

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
  const [isLoading, setIsLoading] = useState(false)

  const [, stackUpdateMutation] = useMutation(stackUpdateMutationGQL)

  const history = useHistory()

  const submitButtonStyles = { minWidth: '15em', maxWidth: '15em' }

  const updatestack = () => {
    setIsLoading(true)
    var actionsStripped = []
    actions.forEach(action => {
      actionsStripped.push({ ...action, device: { id: action.device.id }, providerFunction: { id: action.providerFunction.id, label: action.providerFunction.label }, parameters: action.parameters })
    })
    const stackUpdateObject = { stack: { ...stack, actions: actionsStripped, realm: contextRealm.id, core: contextRealm.coreID } }
    stackUpdateMutation(stackUpdateObject).then(history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks` }))
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
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} size='small' style={{ paddingRight: 0 }} kind='ghost'>
              <ArrowUp16 />
            </Button>
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index + 1)) }} size='small' kind='ghost'>
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
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} style={{ paddingRight: 0 }} size='small' kind='ghost'>
              <ArrowUp16 />
            </Button>
            <Button onClick={() => {
              const mutatedActionArray = arrayMove(actions, index, index + 1)
              setActions(mutatedActionArray)
            }} size='small' kind='ghost'>
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
            <Button onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} style={{ paddingRight: 0 }} size='small' kind='ghost'>
              <ArrowUp16 />
            </Button>
            <Button onClick={() => { setActions(arrayMove(actions, index, index + 1)) }} size='small' kind='ghost'>
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
            <Button onClick={() => { setActions(arrayMove(actions, index, index - 1)) }} style={{ paddingRight: 0 }} size='small' kind='ghost'>
              <ArrowUp16 />
            </Button>
            <Button disabled onClick={() => { setActions(arrayMove(actions, index, index + 1)) }} size='small' kind='ghost'>
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
            value={stack.label ?? ''}
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
            value={stack.panelLabel ?? ''}
            labelText='Stack Panel Label'
            helperText='This is what will be displayed on panels, if left blank the stack name will be used'
            onClick={() => {}}
            onChange={(e) => { setStack({ ...stack, panelLabel: e.target.value }) }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput
            type='text'
            id='newstackDescription'
            placeholder='Optional'
            value={stack.description ?? ''}
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
      </Row>
      <Row>
        <Column>
          <Accordion>
            { actions && actions.map((item, index) =>
              <Row key={index}>
                <Column style={{ maxWidth: '7.5em', paddingRight: 0, marginTop: '0.5em' }}>
                  { getActionMoveButtons(index) }
                </Column>
                <Column style={{ paddingLeft: 0 }}>
                  <AccordionItem title={`Action ${index + 1}: ${item.providerFunction.label} on ${item.device.label}`} key={JSON.stringify(item)}>
                    <Action index={index} action={item} delete={deleteAction} setActions={setActionsProxy} providers={providers} devices={devices}></Action>
                  </AccordionItem>
                </Column>
              </Row>
            )}
            <Button renderIcon={Add24} size='small' style={{ marginLeft: '7em', marginTop: '1em', visibility: newActionVisibility ? 'hidden' : 'visible', height: newActionVisibility ? '0' : '', minHeight: newActionVisibility ? '0' : '' }} onClick={() => { setNewActionVisibility(true) }}>
              Add {actions.length === 0 ? 'An' : 'Another'} Action
            </Button>
          </Accordion>
          <br/>
          { newActionVisibility &&
            <div style={{ marginLeft: '7.5em', marginRight: '1em' }}>
              New Action
              <Padding size={5}/>
              <Action new index={actions.length + 1} delete={deleteAction} setActions={setActionsProxy} providers={providers} devices={devices}></Action>
            </div>
          }
          <Padding size={5}/>
        </Column>
      </Row>
      <br/>
      <Row>
        <Column>
          <ButtonSet style={{ float: 'right', marginRight: '5em' }}>
            <Button
              renderIcon={Exit24}
              onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks` }) }}
              size='default' kind='secondary'
            >
              Go Back
            </Button>
            { isLoading
              ? <InlineLoading description='Updating Stack' status='active' />
              : <Button disabled={actions.length === 0 || !stack.label} onClick={() => { updatestack() }} kind='primary' style={submitButtonStyles}>
                { !isNew && <>Update Stack</> }
                { isNew && <>Create Stack</> }
              </Button>
            }
          </ButtonSet>
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
