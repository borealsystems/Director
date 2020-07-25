import React from 'react'
import { useQuery } from 'urql'
import { DataTable, Loading, ToastNotification } from 'carbon-components-react'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableExpandRow, TableExpandedRow, TableBody, TableCell } = DataTable

const Bridges = () => {
  const headers = [
    {
      key: 'address',
      header: 'Address'
    },
    {
      key: 'type',
      header: 'Bridge Type'
    },
    {
      key: 'version',
      header: 'Bridge Version'
    }
  ]

  const [result] = useQuery({
    query: `query getBridges {
      getBridges {
        type
        address
        version
        controllers {
          manufacturer
          model
          serial
        }
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
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <DataTable
          isSortable
          rows={result.data.getBridges}
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
              title="Bridges"
              description="A Bridge is an application that connects a non-network device to DirectorCore."
              {...getTableContainerProps()}
            >
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
                        { JSON.stringify(row) }
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

export default Bridges
