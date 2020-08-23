import React from 'react'
import { useQuery } from 'urql'
import { DataTable, DataTableSkeleton } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'

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
      <GraphQLError caption={result.error.message} />
    )
  }
  if (result.fetching) return <DataTableSkeleton headers={headers} />
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
                  {rows.length !== 0 && rows.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        { result.data.getBridges[index].controllers && result.data.getBridges[index].controllers.map((controller, index) => (
                          <div key={index}>
                            Controller: {controller.manufacturer.replace(/^\w/, c => c.toUpperCase())} {controller.model.replace(/^\w/, c => c.toUpperCase())} <br/>
                            Serial: {controller.serial}
                          </div>
                        )) }
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
