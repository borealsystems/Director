import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, Loading, TableToolbar, TableToolbarContent } from 'carbon-components-react'
import headers from './stacksHeaders'
import NewStack from './components/NewStack.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Devices = () => {
  const [newStackVisability, setNewStackVisability] = useState(true)
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
          Stacks
        </h1>
        <GraphQLError error={result.error.message} />
      </div>
    )
  }
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <h1>Stacks</h1>
        <p>
          Stacks are an action or group of actions that can be executed by a Controller or API endpoint.
        </p>
        <br />
        <DataTable
          isSortable
          rows={result.data.getDevices}
          headers={headers}
          render={({ rows, headers, getHeaderProps }) => (
            <TableContainer>
              {!newStackVisability &&
              <div>
                <TableToolbar>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  {/* <TableToolbarSearch onChange={() => {}} /> */}
                  <TableToolbarContent>
                    <Button onClick={() => { setNewStackVisability(true) }} style={{ minWidth: '20%' }} size='default' kind="primary">
                      Add new
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
              </div>
              }
              {newStackVisability &&
              <div>
                <TableToolbar>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  {/* <TableToolbarSearch onChange={() => {}} /> */}
                  <TableToolbarContent>
                    <Button onClick={() => { setNewStackVisability(false) }} style={{ minWidth: '20%', marginRight: '-2px' }} size='default' kind="secondary">
                      Cancel
                    </Button>
                    <Button onClick={() => { setNewStackVisability(false) }} style={{ minWidth: '20%' }} size='default' kind="primary">
                      Submit
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <NewStack visability={ setNewStackVisability }/>
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
