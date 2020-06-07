import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, Loading, TableToolbar, TableToolbarContent } from 'carbon-components-react'
import deviceHeaders from './components/deviceHeaders'
// import NewDevice from './components/NewDevice.jsx'
import GraphQLError from '../components/GraphQLError.jsx'
import Device from './components/Device.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Devices = () => {
  const [newDeviceVisability, setNewDeviceVisibility] = useState(false)
  const [result] = useQuery({
    query: `query getDevicesAndProviders {
      getDevices {
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
      getProviders {
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
        <DataTable
          isSortable
          rows={result.data.getDevices}
          headers={deviceHeaders}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Devices"
              description="Devices are a piece of hardware or software configured to be controlled by BorealDirector."
              {...getTableContainerProps()}
            >
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
                {/* <TableToolbar>
                  <TableToolbarContent>
                    <Button onClick={() => { setNewDeviceVisibility(false) }} style={{ minWidth: '20%' }} size='default' kind="secondary">
                      Cancel
                    </Button>
                  </TableToolbarContent>
                </TableToolbar> */}
                <Device new providers={result.data.getProviders} visability={ setNewDeviceVisibility }/>
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
                  {rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 1}>
                        <Device devices={result.data.getDevices} providers={result.data.getProviders} deviceID={row.id} />
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
