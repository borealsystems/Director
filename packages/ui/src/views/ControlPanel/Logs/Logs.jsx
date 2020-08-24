import React from 'react'
import { useQuery } from 'urql'
import { DataTable, DataTableSkeleton } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Logs = () => {
  const headers = [
    {
      key: 'time',
      header: 'Time'
    },
    {
      key: 'path',
      header: 'Path'
    },
    {
      key: 'message',
      header: 'Log Message'
    },
    {
      key: 'level',
      header: 'Log Level'
    }
  ]

  const [result] = useQuery({
    query: `query getLogs {
      getLogs {
        id
        time
        level
        path
        message
      }
    }`,
    pollInterval: 1000
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton />
  if (result.data) {
    return (
      <div>
        <DataTable
          rows={result.data.getLogs.reverse()}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Logs"
              description="Live Logs from DirectorCore, Newest First"
              {...getTableContainerProps()}>
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

export default Logs
