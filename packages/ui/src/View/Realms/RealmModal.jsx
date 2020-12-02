import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'urql'
import omit from 'lodash/omit'

import {
  Modal,
  TextInput,
  TextArea,
  InlineNotification,
  InlineLoading
} from 'carbon-components-react'

import { updateRealmMutationGQL } from './realmQueries'

const RealmModal = ({ realmData, render, updateRealmsQuery }) => {
  const [realm, setRealm] = useState({ ...realmData })
  const [realmModalSubmitting, setRealmModalSubitting] = useState(false)
  const [realmModalVisible, setRealmModalVisible] = useState(false)
  const openRealm = () => setRealmModalVisible(true)

  const [realmUpdateMutationResult, realmUpdateMutation] = useMutation(updateRealmMutationGQL)

  const submitAndCloseRealm = () => {
    setRealmModalSubitting(true)
    const realmUpdateObject = omit(realm, ['coreLabel'])
    realmUpdateMutation({ realm: realmUpdateObject })
      .then((response) => {
        setRealmModalSubitting(false)
        if (!response.error) {
          updateRealmsQuery()
          setRealmModalVisible(false)
        }
      })
  }

  return (
    <>
      { render(openRealm) }
      <Modal
        hasForm
        className='realmModalWrapper'
        selectorPrimaryFocus='#realmLabel'
        modalHeading={`${realm.coreLabel} / ${realm.label}`}
        modalLabel={realm.id}
        primaryButtonText={realmModalSubmitting ? <>Submitting<InlineLoading/></> : 'Update'}
        primaryButtonDisabled={realmModalSubmitting || !realm.label}
        secondaryButtonText='Cancel'
        open={realmModalVisible}
        onRequestClose={() => setRealmModalVisible(false)}
        onRequestSubmit={() => submitAndCloseRealm()}
        onSecondarySubmit={() => setRealmModalVisible(false)}
      >
        <TextInput
          type='text'
          id='coreLabel'
          value={realm.coreLabel}
          labelText='Core'
          disabled
          onChange={() => {}}
        /> <br />
        <TextInput
          type='text'
          id='realmID'
          placeholder='A short unique identifier, this cannot be changed later'
          value={realm.id ?? ''}
          labelText='Realm ID'
          invalidText='A Realm with this ID already exists, you cannot create more than one realm with the same ID'
          disabled
        /> <br />
        <TextInput
          type='text'
          id='realmLabel'
          placeholder='A human friendly name.'
          value={realm.label ?? ''}
          labelText='Realm Name'
          warnText='A Realm with this name already exists, while you can create multiple realms with the same name, it may result in confusion'
          required
          disabled={realm.id === 'ROOT'}
          onChange={e => { setRealm({ ...realm, label: e.target.value }) }}
        /> <br />
        <TextInput
          type='text'
          id='realmDescription'
          placeholder='Additional information about this Realm'
          value={realm.description ?? ''}
          labelText='Realm Description'
          onChange={e => { setRealm({ ...realm, description: e.target.value }) }}
        /><br/>
        <TextArea
          labelText='Realm Notes'
          placeholder='Notes about this realm will be shown to users in the Realm Dashboard, this box supports Markdown text formatting so you can link your organizations helpdesk and other useful things'
          value={realm.notes ?? ''}
          onChange={e => { setRealm({ ...realm, notes: e.target.value }) }}
        />
        { realmUpdateMutationResult.error &&
              <InlineNotification
                kind='error'
                title='An error occured during realm creation'
                subtitle='If this persists, contact your system administrator'
              />
        }
      </Modal>
    </>
  )
}

RealmModal.propTypes = {
  realmData: PropTypes.object,
  render: PropTypes.func,
  updateRealmsQuery: PropTypes.func
}

export default RealmModal
