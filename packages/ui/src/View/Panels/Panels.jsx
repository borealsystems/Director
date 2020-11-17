import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import { Add24 } from '@carbon/icons-react'
import { Button, Column, DataTable, DataTableSkeleton, Grid, OverflowMenu, OverflowMenuItem, Pagination, Row } from 'carbon-components-react'
import { panelsGQL, deletePanelGQL } from './queries'
import ModalStateManager from '../components/ModalStateManager.jsx'
import DeleteObjectModal from '../components/DeleteObjectModal.jsx'
import headers from './panelsHeaders'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'

import image from './undraw_control_panel1_20gm.svg'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Panels = () => {
  const { contextRealm } = useContext(globalContext)
  const [result, refresh] = useQuery({
    query: panelsGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const history = useHistory()

  const [, deletePanelMutation] = useMutation(deletePanelGQL)

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    const rawData = result.data.panels
    const filteredTableData = rawData.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase()) ||
         e.location?.toLowerCase().includes(filter.toLowerCase())
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
                <h4>{contextRealm.coreLabel}{contextRealm.id === 'ROOT' ? '' : ` / ${contextRealm.label}`} has no Panels</h4>
              </Row>
              <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
              <Row>
                Panels are where you organise and assign Stacks to buttons. You will need to create some to make the best use of Director, but you can use it without them by executing Stacks directly.
              </Row>
              <span style={{ display: 'inline-block', height: '1rem' }}>&nbsp;</span>
              <Row>
                <Button renderIcon={Add24} onClick={() => { history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/panels/new` }) }}>Create A Panel</Button>
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
        <div>
          <DataTable
            rows={currentTableData ?? []}
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
                title="Panels"
                description="Panels are where you organise and assign Stacks to buttons."
                {...getTableContainerProps()}
              >
                <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={(e) => setFilter(e.target.value)} />
                    <Button renderIcon={Add24} onClick={() => { history.push({ pathname: 'panels/new' }) }}>New Panel</Button>
                  </TableToolbarContent>
                </TableToolbar>
                { rawData.length > 0 &&
                  <>
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
                                    <OverflowMenuItem itemText='Edit Panel' onClick={() => history.push({ pathname: `panels/${row.cells[0].value}` })} />
                                    <OverflowMenuItem itemText='Delete Panel' isDelete onClick={() => setOpen(true)} />
                                  </OverflowMenu>
                                )}
                                ModalContent={({ open, setOpen }) => (
                                  <DeleteObjectModal
                                    open={open}
                                    setOpen={setOpen}
                                    type='panel'
                                    id={row.cells[0].value}
                                    label={row.cells[1].value}
                                    deleteFunction={deletePanelMutation}
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
                  </>
                }
              </TableContainer>
            )}
          />
        </div>
      )
    }
  }
}

export default Panels
