import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, Loading, TableToolbar, TableToolbarContent } from 'carbon-components-react'
import headers from './headers'
import NewDevice from './NewDevice.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Devices = () => {
  const [newDeviceVisability, setNewDeviceVisibility] = useState(false)
  const [result] = useQuery({
    query: `query getDevices {
      getDevices {
        name
        id
        provider
        status
        enabled
        description
        location
      }
    }`,
    pollInterval: 1000
  })

  if (result.error) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Devices
        </h1>
        <GraphQLError caption={result.error.message} />
      </div>
    )
  }
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <h1>Devices</h1>
        <p>
          Devices are a piece of hardware or software configured to be controlled by BorealDirector.
        </p>
        <br />
        <DataTable
          isSortable
          rows={result.data.getDevices}
          headers={headers}
          render={({ rows, headers, getHeaderProps }) => (
            <TableContainer>
              {!newDeviceVisability &&
              <div>
                <TableToolbar>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  {/* <TableToolbarSearch onChange={() => {}} /> */}
                  <TableToolbarContent>
                    <Button onClick={() => { setNewDeviceVisibility(true) }} style={{ minWidth: '20%' }} size='default' kind="primary">
                      Add new
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
              </div>
              }
              {newDeviceVisability &&
              <div>
                <TableToolbar>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  {/* <TableToolbarSearch onChange={() => {}} /> */}
                  <TableToolbarContent>
                    <Button onClick={() => { setNewDeviceVisibility(false) }} style={{ minWidth: '20%' }} size='default' kind="primary">
                      Cancel
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <NewDevice visability={ setNewDeviceVisibility }/>
              </div>
              }
              <Table>
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
                  {rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      {row.isExpanded && (
                        <TableExpandedRow colSpan={headers.length + 1}>
                          <p>Pretend this works</p>
                        </TableExpandedRow>
                      )}
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
