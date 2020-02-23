import React from 'react'
import { useQuery } from 'urql'
import { DataTable, Loading, ToastNotification } from 'carbon-components-react'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Logs = () => {
  const headers = [
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
    query: '{ getLogs }'
  })

  if (result.error) {
    return (
      <ToastNotification
        caption={result.error}
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
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Logs
        </h1>
        <DataTable
          rows={result.data.getLogs}
          headers={headers}
          render={({ rows, headers, getHeaderProps }) => (
            <TableContainer>
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
