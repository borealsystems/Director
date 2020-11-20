import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Column, DataTable, DataTableSkeleton, Grid, OverflowMenu, OverflowMenuItem, Pagination, Row } from 'carbon-components-react'
import { stacksQueryGQL, deleteStackGQL, duplicateStackGQL, executeStackMutationGQL } from './queries'
import { useHistory } from 'react-router-dom'
import { Add24 } from '@carbon/icons-react'
import ModalStateManager from '../components/ModalStateManager.jsx'
import DeleteObjectModal from '../components/DeleteObjectModal.jsx'
import GraphQLError from '../components/GraphQLError.jsx'
import headers from './stacksHeaders'
import globalContext from '../../globalContext'

import image from './undraw_completed_steps_yurw.svg'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const { contextRealm } = useContext(globalContext)
  const [result, refresh] = useQuery({
    query: stacksQueryGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const history = useHistory()

  const [, deleteStackMutation] = useMutation(deleteStackGQL)
  const [, duplicateStackMutation] = useMutation(duplicateStackGQL)
  const [, executeStackMutation] = useMutation(executeStackMutationGQL)

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    const rawData = result.data.stacks
    const filteredTableData = rawData.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase()) ||
         e.panelLabel?.toLowerCase().includes(filter.toLowerCase())
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
                <h4>{contextRealm.coreLabel}{contextRealm.id === 'ROOT' ? '' : ` / ${contextRealm.label}`} has no stacks</h4>
              </Row>
              <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
              <Row>
                Stacks are an Action or group of Actions that can be executed by a Controller or a device that can control Director, You will need to create some to make use of Director.
              </Row>
              <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
              <Row>
                <Button renderIcon={Add24} onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks/new` }) }}>Create A Stack</Button>
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
        <DataTable
          rows={currentTableData ? currentTableData.map(stack => ({ actionsCount: stack.actions?.length, ...stack })) : []}
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
              title='Stacks'
              description='Stacks are an Action or group of Actions that can be executed by a Controller or a device that can control Director'
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(e) => setFilter(e.target.value)} />
                  <Button renderIcon={Add24} onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks/new` }) }}>New Stack</Button>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell>
                        <ModalStateManager
                          LauncherContent={({ setOpen }) => (
                            <OverflowMenu flipped>
                              <OverflowMenuItem itemText='Edit Stack' onClick={() => history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks/${row.cells[0].value}` })} />
                              <OverflowMenuItem itemText='Duplicate Stack' onClick={() => {
                                duplicateStackMutation({ id: row.cells[0].value })
                                  .then(result => {
                                    if (result.data?.duplicateStack) history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks/${result.data.duplicateStack}` })
                                  })
                              }} />
                              <OverflowMenuItem itemText='Execute Stack' onClick={() => executeStackMutation({ id: row.cells[0].value })} />
                              <OverflowMenuItem itemText='Delete Stack' isDelete onClick={() => setOpen(true)} />
                            </OverflowMenu>
                          )}
                          ModalContent={({ open, setOpen }) => (
                            <DeleteObjectModal
                              open={open}
                              setOpen={setOpen}
                              type='stack'
                              id={row.cells[0].value}
                              label={row.cells[1].value}
                              deleteFunction={deleteStackMutation}
                              refreshFunction={refresh}
                            />
                          )} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                style={{ width: '100%' }}
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageNumberText="Page Number"
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
      )
    }
  }
}

export default Devices
