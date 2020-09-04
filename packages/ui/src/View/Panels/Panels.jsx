import React from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, DataTable, DataTableSkeleton, InlineNotification, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { Add24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'
import headers from './panelsHeaders'
import GraphQLError from '../components/GraphQLError.jsx'
import { panelsGQL, deletePanelGQL } from './queries'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Panels = () => {
  const [result] = useQuery({
    query: panelsGQL,
    pollInterval: 1000
  })

  const history = useHistory()

  const [, deletePanelMutation] = useMutation(deletePanelGQL)

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
            getToolbarProps,
            onInputChange,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Panels"
              description="Panels are where you organise and assign Stacks to buttons."
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  { rows.length > 0 && <TableToolbarSearch onChange={onInputChange} /> }
                  <Button renderIcon={Add24} onClick={() => { history.push({ pathname: '/config/panels/new' }) }}>New Panel</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell className="bx--table-column-menu">
                        <OverflowMenu disabled={row.cells[0].value === '0'} flipped>
                          <OverflowMenuItem itemText='Edit Panel' onClick={() => history.push({ pathname: `/config/panels/${row.cells[0].value}` })} />
                          <OverflowMenuItem itemText='Delete Panel' isDelete onClick={() => deletePanelMutation({ id: row.cells[0].value })} />
                        </OverflowMenu>
                      </TableCell>
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

export default Panels
