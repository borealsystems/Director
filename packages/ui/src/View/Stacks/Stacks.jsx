import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, DataTable, DataTableSkeleton, OverflowMenu, OverflowMenuItem, Pagination } from 'carbon-components-react'
import { stacksQueryGQL, deleteStackGQL, executeStackMutationGQL } from './queries'
import { useHistory } from 'react-router-dom'
import { Add24 } from '@carbon/icons-react'
import headers from './stacksHeaders'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const { contextRealm } = useContext(globalContext)
  const [result, reExecute] = useQuery({
    query: stacksQueryGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const history = useHistory()

  const [, deleteStackMutation] = useMutation(deleteStackGQL)
  const [, executeStackMutation] = useMutation(executeStackMutationGQL)

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    const filteredTableData = result.data.stacks.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase()) ||
         e.panelLabel?.toLowerCase().includes(filter.toLowerCase())
    })

    const currentTableData = Array(Math.ceil(result.data.stacks.length / pageSize)).fill()
      .map((_, index) => index * pageSize)
      .map(begin => filteredTableData
        .slice(begin, begin + pageSize)
      )[page - 1]

    return (
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
          getTableContainerProps
        }) => (
          <TableContainer
            title="Stacks"
            description="Stacks are an Action or group of Actions that can be executed by a Controller or API endpoint."
            {...getTableContainerProps()}
          >
            <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
              <TableToolbarContent>
                <TableToolbarSearch onChange={(e) => setFilter(e.target.value)} />
                <Button renderIcon={Add24} onClick={() => { history.push({ pathname: 'devices/new' }) }}>New Device</Button>
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
                      { !row.cells[0].value.match(/CORE-/) &&
                        <OverflowMenu flipped>
                          <OverflowMenuItem itemText='Edit Stack' onClick={() => history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/stacks/${row.cells[0].value}` })} />
                          <OverflowMenuItem itemText='Execute Stack' onClick={() => executeStackMutation({ id: row.cells[0].value })} />
                          <OverflowMenuItem itemText='Delete Stack' isDelete onClick={() => deleteStackMutation({ id: row.cells[0].value }).then(reExecute())} />
                        </OverflowMenu>
                      }
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

export default Devices
