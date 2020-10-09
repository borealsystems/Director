import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'urql'
import {
  Button,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TextInput,
  Modal, InlineNotification, ModalWrapper, TextArea, TooltipIcon
} from 'carbon-components-react'
import { Add24, Edit24, TrashCan24 } from '@carbon/icons-react'

import { createRealmMutationGQL, deleteRealmMutationGQL, realmsQueryGQL } from './realmQueries'
import headers from './headers'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'
import RealmModal from './RealmModal.jsx'

const Realms = ({ updateRealmsQuery }) => {
  const { contextRealm, setContextRealm } = useContext(globalContext)
  const [newRealmModalVisible, setNewRealmModalVisible] = useState(false)
  const [newRealmModalSubitting, setNewRealmModalSubitting] = useState(false)
  const [newRealm, setNewRealm] = useState({})

  const [newRealmMutationResult, newRealmMutation] = useMutation(createRealmMutationGQL)
  const [, deleteRealmMutation] = useMutation(deleteRealmMutationGQL)

  const [result, reexecute] = useQuery({
    query: realmsQueryGQL,
    pollInterval: 10000
  })

  const realmIDIsDuplicate = result.data?.realms.find(realm => realm.id === newRealm.id)
  const realmLabelIsDuplicate = result.data?.realms.find(realm => realm.label === newRealm.label)

  if (contextRealm.id !== 'ROOT') setContextRealm({ ...contextRealm, id: 'ROOT' })

  const closeNewRealmModal = () => {
    setNewRealmModalVisible(false)
    setNewRealm({})
  }

  const submitAndCloseRealm = () => {
    setNewRealmModalSubitting(true)
    newRealmMutation({ realm: { ...newRealm, coreID: contextRealm.coreID } })
      .then((response) => {
        console.log(response)
        setNewRealmModalSubitting(false)
        if (!response.error) {
          updateRealmsQuery()
          closeNewRealmModal()
        }
      })
  }

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton />
  if (result.data) {
    return (
      <>
        <Modal
          hasForm
          selectorPrimaryFocus="#realmID"
          modalHeading={'New Realm'}
          primaryButtonText={newRealmModalSubitting ? <>Submitting<InlineLoading/></> : 'Create'}
          primaryButtonDisabled={newRealmModalSubitting || realmIDIsDuplicate || !newRealm.id || !newRealm.label}
          secondaryButtonText='Cancel'
          open={newRealmModalVisible}
          onRequestClose={closeNewRealmModal}
          onRequestSubmit={submitAndCloseRealm}
          onSecondarySubmit={closeNewRealmModal}
        >
          <TextInput
            type='text'
            id='coreLabel'
            value={contextRealm.coreLabel}
            labelText='Core'
            disabled
            onChange={() => {}}
          /> <br />
          <TextInput
            type='text'
            id='realmID'
            placeholder='A short unique identifier, this cannot be changed later'
            value={newRealm.id ?? ''}
            labelText='Realm ID'
            invalid={realmIDIsDuplicate}
            invalidText='A Realm with this ID already exists, you cannot create more than one realm with the same ID'
            required
            onChange={e => { setNewRealm({ ...newRealm, id: e.target.value.toUpperCase() }) }}
          /> <br />
          <TextInput
            type='text'
            id='realmLabel'
            placeholder='A human friendly name.'
            value={newRealm.label ?? ''}
            labelText='Realm Name'
            warn={!!realmLabelIsDuplicate}
            warnText='A Realm with this name already exists, while you can create multiple realms with the same name, it may result in confusion'
            required
            onChange={e => { setNewRealm({ ...newRealm, label: e.target.value }) }}
          /> <br />
          <TextInput
            type='text'
            id='realmDescription'
            placeholder='Additional information about this Realm'
            value={newRealm.description ?? ''}
            labelText='Realm Description'
            onChange={e => { setNewRealm({ ...newRealm, description: e.target.value }) }}
          /><br/>
          <TextArea
            labelText='Realm Notes'
            placeholder='Notes about this realm will be shown to users in the Realm Dashboard, this box supports Markdown text formatting so you can link your organizations helpdesk and other useful things'
            value={newRealm.notes ?? ''}
            onChange={e => { setNewRealm({ ...newRealm, notes: e.target.value }) }}
          />
          { newRealmMutationResult.error &&
            <InlineNotification
              kind='error'
              title='An error occured during realm creation'
              subtitle='If this persists, contact your system administrator'
            />
          }
        </Modal>
        <DataTable
          rows={result.data.realms}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getToolbarProps,
            onInputChange,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Realms"
              description="Realms are the second level organisation structure that allow you to seperate studios, auditoriums, and spaces in your facility."
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  {rows.length > 0 && <TableToolbarSearch placeHolderText='Filter Realms' onChange={onInputChange} />}
                  <Button renderIcon={Add24} onClick={() => { setNewRealmModalVisible(true) }}>New Realm</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader>
                      Modify
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      {row.cells.map((cell) =>
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      )}
                      <TableCell className='dx--table-modal-trigger'>
                        <RealmModal
                          updateRealmsQuery={updateRealmsQuery}
                          realmData={result.data.realms[i]}
                          render={(openModal) => (
                            <Button
                              kind='ghost'
                              renderIcon={Edit24}
                              hasIconOnly
                              iconDescription='Edit'
                              onClick={() => {
                                openModal()
                              }}
                            />
                          )}
                        />
                        { row.cells[0].value !== 'ROOT' &&
                        <TooltipIcon tooltipText='Delete' direction='top'>
                          <ModalWrapper
                            id="realmModalWrapper"
                            selectorPrimaryFocus="button"
                            triggerButtonKind='ghost'
                            renderTriggerButtonIcon={TrashCan24}
                            modalLabel='Delete Realm'
                            modalHeading={`Are you really sure you want to delete ${row.cells[4].value} / ${row.cells[1].value}?`}
                            primaryButtonText='Delete Realm'
                            secondaryButtonText='Cancel'
                            shouldCloseAfterSubmit={true}
                            handleSubmit={() => new Promise((resolve, reject) => {
                              deleteRealmMutation({ realm: { coreID: row.cells[3].value, id: row.cells[0].value } })
                                .then((res) => {
                                  if (!res.error) {
                                    reexecute()
                                    updateRealmsQuery()
                                    resolve(true)
                                  } else reject(res.error)
                                })
                            })}>
                            <p>Deleting this realm is permanent and cannot be undone, all devices, stack, and panels associated with this realm will also be deleted.</p>
                          </ModalWrapper>
                        </TooltipIcon>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      </>
    )
  }
}

Realms.propTypes = {
  updateRealmsQuery: PropTypes.func,
  updateRealms: PropTypes.func
}

export default Realms
