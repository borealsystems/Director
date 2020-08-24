import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, DataTableSkeleton, Checkbox } from 'carbon-components-react'
import deviceHeaders from './components/deviceHeaders'
import GraphQLError from '../components/GraphQLError.jsx'
import Device from './components/Device.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const [newDeviceVisability, setNewDeviceVisibility] = useState(false)
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
      providers {
        id
        label
        protocol
        parameters {
          required
          id
          label
          regex
        }
      }
    }`,
    pollInterval: 1000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={deviceHeaders} />
  if (result.data) {
    return (
      <div>
        <DataTable
          isSortable
          rows={result.data.devices}
          headers={deviceHeaders}
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
              {!newDeviceVisability &&
                <div>
                  <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                    <TableToolbarContent>
                      <TableToolbarSearch onChange={onInputChange} />
                      <Button onClick={() => { setNewDeviceVisibility(true) }}>New Device</Button>
                    </TableToolbarContent>
                  </TableToolbar>
                </div>
              }
              {newDeviceVisability &&
                <div>
                  <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                    <TableToolbarContent>
                      <TableToolbarSearch onChange={onInputChange} />
                      <Button onClick={() => { setNewDeviceVisibility(false) }} size='default' kind="secondary">Cancel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                    </TableToolbarContent>
                  </TableToolbar>
                  <Device new providers={result.data.providers} visability={ setNewDeviceVisibility }/>
                </div>
              }
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableHeader />
                    {headers.map((header, index) => (
                      <TableHeader key={index} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
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
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 1}>
                        <Device devices={result.data.devices} providers={result.data.providers} deviceID={row.id} index={index} />
                      </TableExpandedRow>
                    </React.Fragment>
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
