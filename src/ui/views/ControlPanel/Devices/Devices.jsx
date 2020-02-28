import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, Loading, ToastNotification, TableToolbar, TableToolbarContent } from 'carbon-components-react'
import headers from './headers'
import NewDevice from './NewDevice.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Devices = () => {
  const [newDeviceVisability, setNewDeviceVisibility] = useState(true)
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
        configuration {
          name
          value
        }
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
        <ToastNotification
          caption={result.error.message}
          hideCloseButton={true}
          kind="error"
          lowContrast
          notificationType="toast"
          role="alert"
          style={{
            marginBottom: '.5rem',
            minWidth: '30rem'
          }}
          subtitle="The Director UI cannot communicate with the server or the server encountered an error. Please check your network connection then contact your system administrator."
          timeout={0}
          title="GraphQL Error"
        />
      </div>
    )
  }
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Devices
        </h1>
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
                <NewDevice />
              </div>
              }
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHeader key={index} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
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
