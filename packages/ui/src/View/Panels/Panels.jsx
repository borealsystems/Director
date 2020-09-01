import React from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, DataTableSkeleton, InlineNotification } from 'carbon-components-react'
import { Add24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'
import headers from './panelsHeaders'
import GraphQLError from '../components/GraphQLError.jsx'
import Panel from './components/Panel.jsx'
import { panelsGQL } from './queries'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Panels = () => {
  const [result] = useQuery({
    query: panelsGQL,
    pollInterval: 1000
  })

  const history = useHistory()

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
          rows={result.data.panels}
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
              title="Panels"
              description="A Panel is the virtual interface you make buttons with stacks on."
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  { rows.length > 0 && <TableToolbarSearch onChange={onInputChange} /> }
                  <Button renderIcon={Add24} onClick={() => { history.push({ pathname: '/config/panels/new' }) }}>New Panel</Button>
                </TableToolbarContent>
              </TableToolbar>
              { rows.length > 0 &&
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
                          <Panel panels={result.data.panels} panelID={row.id} stacks={result.data.stacks}/>
                        </TableExpandedRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              }
            </TableContainer>
          )}
        />
      </div>
    )
  }
}

export default Panels
