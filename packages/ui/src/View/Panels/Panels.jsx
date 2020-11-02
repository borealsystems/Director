import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import { Add24 } from '@carbon/icons-react'
import { Button, DataTable, DataTableSkeleton, OverflowMenu, OverflowMenuItem, Pagination } from 'carbon-components-react'
import { panelsGQL, deletePanelGQL } from './queries'
import headers from './panelsHeaders'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Panels = () => {
  const { contextRealm } = useContext(globalContext)
  const [result] = useQuery({
    query: panelsGQL,
    pollInterval: 1000,
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

    return (
      <div>
        <DataTable
          isSortable
          rows={currentTableData}
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
                        <OverflowMenu disabled={row.cells[0].value === '0'} flipped>
                          <OverflowMenuItem itemText='Edit Panel' onClick={() => history.push({ pathname: `panels/${row.cells[0].value}` })} />
                          <OverflowMenuItem itemText='Delete Panel' isDelete onClick={() => deletePanelMutation({ id: row.cells[0].value })} />
                        </OverflowMenu>
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
      </div>
    )
  }
}

export default Panels
