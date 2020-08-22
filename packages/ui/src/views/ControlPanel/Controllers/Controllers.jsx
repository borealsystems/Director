import React from 'react'
import { useQuery } from 'urql'
import { DataTable, Loading } from 'carbon-components-react'
import GraphQLError from '../components/GraphQLError.jsx'
import Controller from './components/Controller.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableExpandRow, TableExpandedRow, TableBody, TableCell } = DataTable

const Controllers = () => {
  const headers = [
    {
      key: 'label',
      header: 'Name'
    },
    {
      key: 'manufacturer',
      header: 'Manufacturer'
    },
    {
      key: 'model',
      header: 'Model'
    },
    {
      key: 'serial',
      header: 'Serial Number'
    },
    { // TODO Awaiting Upstream
      key: 'panel.label',
      header: 'Panel'
    },
    {
      key: 'status',
      header: 'Status'
    }
  ]

  const [result] = useQuery({
    query: `query controllers {
      controllers {
        label
        manufacturer
        model
        serial
        status
        panel {
          id
          label
        }
        id
      }
      panels {
        id
        label
      }
    }`,
    pollInterval: 1000
  })

  if (result.error) {
    return (
      <GraphQLError caption={result.error.message} />
    )
  }
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <DataTable
          isSortable
          rows={result.data.controllers}
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
              title="Controllers"
              description="A Controller is the thing you use to actually make things happen."
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
                          <TableCell key={cell.index}>{cell.value}</TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <Controller controllerID={row.id} controllers={result.data.controllers} panels={result.data.getPanels} />
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

export default Controllers
