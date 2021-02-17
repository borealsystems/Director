import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import {
  Button,
  Column,
  ComboBox,
  DataTable,
  DataTableSkeleton,
  Grid,
  InlineLoading,
  Modal,
  ModalWrapper,
  Pagination,
  Row,
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
  Tag,
  TextInput,
  TooltipIcon
} from 'carbon-components-react'
import { Add24, Tag16, Edit24, TrashCan24, Renew24 } from '@carbon/icons-react'

import { tagsQueryGQL, updateTagMutationGQL, deleteTagMutationGQL } from './queries'
import TagModal from './TagModal.jsx'

import headers from './headers'
import GraphQLError from '../components/GraphQLError.jsx'
import globalContext from '../../globalContext'

import image from './undraw_collecting_fjjl.svg'


const Tags = () => {
  const { contextRealm } = useContext(globalContext)

  const [newTagModalSubmitting, setNewTagModalSubmitting] = useState(false)
  const [newTagModalVisible, setNewTagModalVisibility] = useState(false)

  const [result, reexecute] = useQuery({
    query: tagsQueryGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID },
    pollInterval: 10000,
    pause: newTagModalVisible
  })

  const [newTagMutationResult, newTagMutation] = useMutation(updateTagMutationGQL)
  const [, deleteTagMutation] = useMutation(deleteTagMutationGQL)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const [newTag, setNewTag] = useState({})

  const closeNewTagModal = () => setNewTagModalVisibility(false)
  const submitAndCloseTag = () => {
    setNewTagModalSubmitting(true)
    newTagMutation({ tag: { ...newTag, realm: contextRealm.id, core: contextRealm.coreID } })
      .then(() => {
        if (newTagMutationResult.error) {}
        else {
          setNewTag({})
          setNewTagModalVisibility(false)
          setNewTagModalSubmitting(false)
        }
      })
  }

  const newTagIDIsDuplicate = result.data?.tags.find(realm => realm.id === newTag.id)
  const newTagLabelIsDuplicate = result.data?.tags.find(realm => realm.label === newTag.label)

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton />
  if (result.data) {
    const rawData = result.data.tags
    const filteredTableData = rawData.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase())
    })

    const currentTableData = Array(Math.ceil(rawData.length / pageSize)).fill()
      .map((_, index) => index * pageSize)
      .map(begin => filteredTableData
        .slice(begin, begin + pageSize)
      )[page - 1]
    
    if (rawData.length === 0) {
      return (
        <Grid className='dx--table-empty'>
          <Row>
            <Column sm={{ span: 1 }}>
              <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
              <Row>
                <h4>{contextRealm.coreLabel}{contextRealm.id === 'ROOT' ? '' : ` / ${contextRealm.label}`} has no Tags</h4>
              </Row>
              <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
              <Row>
                Tags are an easy way to filter and classify Stacks, Panels, and Controllers within a realm.
              </Row>
            </Column>
            <Column>
              <Row>
                <span style={{ display: 'inline-block', height: '4rem' }}>&nbsp;</span>
              </Row>
              <Row>
                <img src={image} width='60%' style={{ marginLeft: '25%' }}/>
              </Row>
            </Column>
          </Row>
          <span style={{ display: 'inline-block', height: '4rem' }}>&nbsp;</span>
        </Grid>
      )
    }
  
    if (rawData.length > 0) {
      return (
        <>
          <Modal
            hasForm
            selectorPrimaryFocus='#tagID'
            modalHeading={<>New Tag &nbsp;&nbsp;<Tag size='sm' renderIcon={Tag16} style={{ color: 'white', backgroundColor: newTag?.colour?.id.concat('E5') ?? '#000000' }}>{newTag.label ?? 'New Tag'}</Tag></>}
            primaryButtonText={newTagModalSubmitting ? <>Creating Tag <InlineLoading/></> : 'Create Tag'}
            primaryButtonDisabled={newTagModalSubmitting || newTagIDIsDuplicate || !newTag.id || !newTag.label || !newTag.colour }
            secondaryButtonText='Cancel'
            open={newTagModalVisible}
            onRequestClose={closeNewTagModal}
            onRequestSubmit={submitAndCloseTag}
            onSecondarySubmit={closeNewTagModal}
          >
            <ComboBox
              ariaLabel='Dropdown'
              id='tagColour'
              titleText='Tag Colour'
              placeholder='Colour'
              items={result.data.globalColours}
              selectedItem={newTag.colour}
              onChange={(e) => { setNewTag({ ...newTag, colour: e.selectedItem}) }}
            /><br />
            <TextInput
              type='text'
              id='tagID'
              placeholder='A short unique identifier, this cannot be changed later'
              value={newTag.id ?? ''}
              labelText='Tag ID'
              invalid={newTagIDIsDuplicate}
              invalidText='A Tag with this ID already exists, you cannot create more than one Tag with the same ID'
              required
              onChange={e => { setNewTag({ ...newTag, id: e.target.value.toUpperCase().slice(0, 15) }) }}
            /> <br />
            <TextInput
              type='text'
              id='tagLabel'
              placeholder='A human friendly name.'
              value={newTag.label ?? ''}
              labelText='Tag Name'
              warn={!!newTagLabelIsDuplicate}
              warnText='A Tag with this name already exists, while you can create multiple realms with the same name, it may result in confusion'
              required
              onChange={e => { setNewTag({ ...newTag, label: e.target.value.slice(0, 100) }) }}
            />
            { newTagMutationResult.error &&
              <InlineNotification
                kind='error'
                title='An error occured during Tag creation'
                subtitle='If this persists, contact your system administrator'
              />
            }
          </Modal>
          <DataTable
            rows={currentTableData}
            headers={headers}
            render={({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getTableProps,
              getToolbarProps,
              getTableContainerProps
            }) => (
              <TableContainer
                title='Tags'
                description='Tags are an easy way to filter and classify Stacks, Panels, and Controllers within a realm.'
                {...getTableContainerProps()}
              >
                <TableToolbar {...getToolbarProps()} aria-label='data table toolbar'>
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={(e) => setFilter(e.target.value)} />
                    <Button renderIcon={Renew24} kind='ghost' iconDescription='Refresh Tags' hasIconOnly onClick={reexecute}/>
                    <Button renderIcon={Add24} onClick={() => setNewTagModalVisibility(true)}>New Tag</Button>
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
                        Tag
                      </TableHeader>
                      <TableHeader>
                        Edit
                      </TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i} {...getRowProps({ row })}>
                        {row.cells.map((cell) =>
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        )}
                        <TableCell>
                          <Tag size='sm' renderIcon={Tag16} style={{ color: 'white', backgroundColor: currentTableData[i]?.colour?.id.concat('E5') }}>
                            {row.cells[1].value}
                          </Tag>
                        </TableCell>
                        <TableCell>
                          <TagModal
                            updateTagsQuery={reexecute}
                            tagData={currentTableData[i]}
                            globalColours={result.data.globalColours}
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
                          <TooltipIcon tooltipText='Delete' direction='top'>
                            <ModalWrapper
                              id='deleteTagModalWrapper'
                              selectorPrimaryFocus='button'
                              triggerButtonKind='ghost'
                              renderTriggerButtonIcon={TrashCan24}
                              modalLabel='Delete Tag'
                              modalHeading={`Are you really sure you want to delete ${row.cells[1].value}?`}
                              primaryButtonText='Delete Tag'
                              secondaryButtonText='Cancel'
                              shouldCloseAfterSubmit={true}
                              handleSubmit={() => new Promise((resolve, reject) => {
                                deleteTagMutation({ id: row.cells[0].value })
                                .then((res) => {
                                  if (!res.error) {
                                    reexecute()
                                    resolve(true)
                                  } else reject(res.error)
                                })
                              })}>
                              <p>Deleting this tag is permanent and cannot be undone, any objects tagged with this will remain but the tag will be removed.</p>
                            </ModalWrapper>
                          </TooltipIcon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  style={{ width: '100%' }}
                  backwardText='Previous page'
                  forwardText='Next page'
                  itemsPerPageText='Items per page:'
                  page={page}
                  pageNumberText='Page Number'
                  pageSize={pageSize}
                  pageSizes={[10, 25, 50, 100]}
                  totalItems={filteredTableData.length}
                  onChange={(e) => {
                    setPage(e.page)
                    setPageSize(e.pageSize)
                  }}
                />
              </TableContainer>
            )}
          />
        </>
      )
    }
  }
}

export default Tags
