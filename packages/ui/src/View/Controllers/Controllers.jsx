import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { DataTable, DataTableSkeleton, InlineNotification, Pagination, Button, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { Add24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'
import { controllersQueryGQL, deleteControllerMutationGQL } from './queries'
import headers from './headers'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Controllers = () => {
  const { contextRealm } = useContext(globalContext)
  const [result, refresh] = useQuery({
    query: controllersQueryGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const [, deleteControllerMutation] = useMutation(deleteControllerMutationGQL)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const isDeletable = cells => {
    return cells[3].value === 'Virtual Controller' || cells[5].value === 'Disconnected'
  }

  const history = useHistory()

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    const rawData = result.data.controllers
    const filteredTableData = rawData.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase()) ||
         e.model?.toLowerCase().includes(filter.toLowerCase()) ||
         e.manufacturer?.toLowerCase().includes(filter.toLowerCase())
    })

    const currentTableData = Array(Math.ceil(rawData.length / pageSize)).fill()
      .map((_, index) => index * pageSize)
      .map(begin => filteredTableData
        .slice(begin, begin + pageSize)
      )[page - 1]

    return (
      <div>
        <InlineNotification
          style={{ width: '100%' }}
          lowContrast={true}
          kind='warning'
          title='This interface is being overhauled'
          subtitle='Items may move and/or break in the near future, please report bugs to Phabricator T96'
          hideCloseButton={true}
        />
        <DataTable
          isSortable
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
              title="Controllers"
              description="A Controller is the thing you use to actually make things happen."
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(e) => setFilter(e.target.value)} />
                  <Button renderIcon={Add24} onClick={() => {
                    history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers/new` })
                  }}>New Controller</Button>
                </TableToolbarContent>
              </TableToolbar>
              {rawData.length > 0 &&
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
                            <OverflowMenu flipped>
                              <OverflowMenuItem itemText='Edit Controller' onClick={() => {
                                history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/controllers/${row.cells[0].value}` })
                              }} />
                              <OverflowMenuItem itemText='Delete Controller' isDelete disabled={!isDeletable(row.cells)} onClick={() => {
                                deleteControllerMutation({ id: row.cells[0].value })
                                setTimeout(() => {
                                  refresh()
                                }, 200)
                              }} />
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
                </>
              }
            </TableContainer>
          )}
        />
      </div>
    )
  }
}

export default Controllers
