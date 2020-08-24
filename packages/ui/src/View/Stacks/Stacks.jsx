import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, DataTableSkeleton } from 'carbon-components-react'
import headers from './stacksHeaders'
import Stack from './components/Stack.jsx'
import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const [newStackVisability, setNewStackVisability] = useState(false)
  const [result] = useQuery({
    query: `query getAll {
      stacks {
        id
        label
        panelLabel
        description
        actions {
          device {
            id,
            label
            provider {
              id
            }
          }
          providerFunction {
            id
            label
          }
          parameters {
            id
            value
          }
        }
      }
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
        providerFunctions {
          id
          label
          parameters {
            id
            label
            inputType
            regex
          }
        }
      }
    }`,
    pollInterval: 1000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    return (
      <div>
        <DataTable
          isSortable
          rows={result.data.stacks}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            onInputChange,
            getToolbarProps,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Stacks"
              description="Stacks are an Action or group of Actions that can be executed by a Controller or API endpoint."
              {...getTableContainerProps()}
            >
              {!newStackVisability &&
                <div>
                  <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                    <TableToolbarContent>
                      <TableToolbarSearch onChange={onInputChange} />
                      <Button onClick={() => { setNewStackVisability(true) }}>New Stack</Button>
                    </TableToolbarContent>
                  </TableToolbar>
                </div>
              }
              {newStackVisability &&
                <div>
                  <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                    <TableToolbarContent>
                      <TableToolbarSearch onChange={onInputChange} />
                      <Button onClick={() => { setNewStackVisability(false) }} size='default' kind="secondary">Cancel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                    </TableToolbarContent>
                  </TableToolbar>
                  <Stack new devices={result.data.devices} providers={result.data.providers} visability={ setNewStackVisability }/>
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
                  {rows.length !== 0 && rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <Stack devices={result.data.devices} stacks={result.data.stacks} providers={result.data.providers} stackID={row.id} />
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
