import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, Loading, TableToolbar, TableToolbarContent } from 'carbon-components-react'
import headers from './panelsHeaders'
import GraphQLError from '../components/GraphQLError.jsx'
import Panel from './components/Panel.jsx'

const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Panels = () => {
  const [newPanelVisability, setNewPanelVisability] = useState(false)
  const [result] = useQuery({
    query: `query getAll {
      stacks {
        id
        label
        panelLabel
        description
      }
      panels {
        id
        label
        description
        layout {
          id
          label
          rows
          columns
        }
        layoutType {
          id
          label
        }
        buttons {
          row
          column
          stack {
            id
            label
            panelLabel
            description
          }
        }
      }
    }`,
    pollInterval: 1000
  })

  if (result.error) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Stacks
        </h1>
        <GraphQLError error={result.error.message} />
      </div>
    )
  }
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
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
            getTableContainerProps
          }) => (
            <TableContainer
              title="Panels"
              description="A Panel is a virtual abstraction of a control interface."
              {...getTableContainerProps()}
            >
              {!newPanelVisability &&
              <div>
                <TableToolbar>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  {/* <TableToolbarSearch onChange={() => {}} /> */}
                  <TableToolbarContent>
                    <Button onClick={() => { setNewPanelVisability(true) }} style={{ minWidth: '20%' }} size='default' kind="primary">
                      Add new
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
              </div>
              }
              {newPanelVisability &&
              <div>
                <TableToolbar>
                  {/* pass in `onInputChange` change here to make filtering work */}
                  {/* <TableToolbarSearch onChange={() => {}} /> */}
                  <TableToolbarContent>
                  </TableToolbarContent>
                </TableToolbar>
                <Panel new stacks={result.data.stacks} visability={ setNewPanelVisability }/>
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
                        <Panel panels={result.data.panels} panelID={row.id} stacks={result.data.stacks}/>
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

export default Panels
