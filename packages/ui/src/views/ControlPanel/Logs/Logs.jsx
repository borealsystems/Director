import React from 'react'
import { useQuery } from 'urql'
import { DataTable, DataTableSkeleton, ToastNotification } from 'carbon-components-react'

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

  if (result.error) {
    return (
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
    )
  }
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
