import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, Loading, TableToolbar, TableToolbarContent } from 'carbon-components-react'
import headers from './stacksHeaders'
import NewStack from './components/NewStack.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

// TODO: delete stacks
// TODO: edit stacks
// TODO: fill content in expandos

const Devices = () => {
  const [newStackVisability, setNewStackVisability] = useState(false)
  const [result] = useQuery({
    query: `query getStacks {
      getStacks {
        id
        name
        description
        actions {
          deviceid
          providerFunctionID
          functionLabel
          parameters {
            id
            value
          }
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
        <DataTable
          isSortable
          rows={result.data.getStacks}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Stacks"
              description="Stacks are an Action or group of Actions that can be executed by a Controller or API endpoint."
              {...getTableContainerProps()}
            >
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
                  </TableToolbarContent>
                </TableToolbar>
                <NewStack visability={ setNewStackVisability }/>
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
                        colSpan={headers.length + 1}
                        className="demo-expanded-td">
                        <h1 className="demo-inner-container-header">
                          Expandable row content
                        </h1>
                        <p className="demo-inner-container-content">
                          Description here
                        </p>
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
