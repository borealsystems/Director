import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import { Button, DataTable, DataTableSkeleton, Checkbox, OverflowMenu, OverflowMenuItem, Pagination } from 'carbon-components-react'
import { Add24 } from '@carbon/icons-react'
import { devicesQueryGQL, deleteDeviceGQL } from './queries'
import GraphQLError from '../components/GraphQLError.jsx'
import globalContext from '../../globalContext'
import headers from './headers'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const { contextRealm } = useContext(globalContext)
  const [result] = useQuery({
    query: devicesQueryGQL,
    pollInterval: 1000,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const [, deleteDeviceMutation] = useMutation(deleteDeviceGQL)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const history = useHistory()

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    const rawData = result.data.devices
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
              title="Devices"
              description="Devices are a piece of hardware or software configured to be controlled by BorealDirector."
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
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'enabled') {
                          return (
                            <TableCell
                              key={cell.id}
                              id={cell.id}
                              className={`la-${cell.info.header}`}>
                              <Checkbox
                                id={'check-' + cell.id}
                                checked={cell.value}
                                hideLabel
                                disabled
                                labelText="checkbox"
                              />
                            </TableCell>
                          )
                        } else {
                          return <TableCell key={cell.id}>{cell.value}</TableCell>
                        }
                      })}
                      <TableCell>
                        { !row.cells[0].value.match(/CORE-/) &&
                          <OverflowMenu flipped>
                            <OverflowMenuItem itemText='Edit Device' onClick={() => history.push({ pathname: `devices/${row.cells[0].value}` })} />
                            <OverflowMenuItem itemText='Delete Device' isDelete onClick={() => deleteDeviceMutation({ idToDelete: row.cells[0].value })} />
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
      </div>
    )
  }
}

export default Devices
