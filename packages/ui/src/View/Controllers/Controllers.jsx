import React, { useContext } from 'react'
import { useQuery } from 'urql'
import { DataTable, DataTableSkeleton, InlineNotification } from 'carbon-components-react'
import { controllersQueryGQL } from './queries'
import headers from './headers'
import globalContext from '../../globalContext'
import GraphQLError from '../components/GraphQLError.jsx'
import Controller from './Controller.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Controllers = () => {
  const { contextRealm } = useContext(globalContext)
  const [result] = useQuery({
    query: controllersQueryGQL,
    pollInterval: 1000,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    return (
      <div>
        <InlineNotification
          style={{ width: '100%' }}
          lowContrast={true}
          kind='warning'
          title='This interface is being overhauled'
          subtitle='Items may move and/or break in the near future, please report bugs to Phabricator T96'
          hideCloseButton={true}
        />
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
            getToolbarProps,
            onInputChange,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Controllers"
              description="A Controller is the thing you use to actually make things happen."
              {...getTableContainerProps()}
            >
              <div>
                <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={onInputChange} />
                  </TableToolbarContent>
                </TableToolbar>
              </div>
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
                        <Controller controllerID={row.id} controllers={result.data.controllers} panels={result.data.panels} />
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
