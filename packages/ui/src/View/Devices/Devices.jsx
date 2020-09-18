import React from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, DataTable, DataTableSkeleton, Checkbox, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { Add24 } from '@carbon/icons-react'
import GraphQLError from '../components/GraphQLError.jsx'
import { useHistory } from 'react-router-dom'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const [result] = useQuery({
    query: `query getDevicesAndProviders {
      devices {
        id
        label
        location
        description
        provider {
          id
          label
        }
        enabled
        status
        configuration {
          id
          value
        }
      }
    }`,
    pollInterval: 1000
  })

  const deleteDeviceGQL = `
    mutation deleteDevice($idToDelete: String!) {
      deleteDevice(id: $idToDelete)
    }
  `

  // eslint-disable-next-line no-unused-vars
  const [deleteDeviceMutationResult, deleteDeviceMutation] = useMutation(deleteDeviceGQL)

  const headers = [
    {
      key: 'id',
      header: 'ID'
    },
    {
      key: 'label',
      header: 'Name'
    },
    {
      key: 'description',
      header: 'Description'
    },
    {
      key: 'location',
      header: 'Location'
    },
    {
      key: 'provider.label',
      header: 'Provider'
    },
    {
      key: 'enabled',
      header: 'Enabled'
    },
    {
      key: 'status',
      header: 'Status'
    }
  ]

  const history = useHistory()

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    return (
      <div>
        <DataTable
          isSortable
          rows={result.data.devices}
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
                  { rows.length > 0 && <TableToolbarSearch onChange={onInputChange} /> }
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
                      <TableCell className="bx--table-column-menu">
                        <OverflowMenu disabled={row.cells[0].value === '0'} flipped>
                          <OverflowMenuItem itemText='Edit Device' onClick={() => history.push({ pathname: `devices/${row.cells[0].value}` })} />
                          <OverflowMenuItem itemText='Delete Device' isDelete onClick={() => deleteDeviceMutation({ idToDelete: row.cells[0].value })} />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      </div>
    )
  }
}

export default Devices
