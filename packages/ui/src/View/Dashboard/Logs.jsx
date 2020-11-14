import React, { useState } from 'react'
import { useQuery } from 'urql'
import { Button, DataTable, DataTableSkeleton, Modal } from 'carbon-components-react'

import GraphQLError from '../components/GraphQLError.jsx'
import { Popup16 } from '@carbon/icons-react'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const Logs = () => {
  const [logModalVisible, setLogModalVisible] = useState(false)
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
    query: `query logs {
      logs {
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
      <>
        <h5>
          Logs
          <Button
            style={{ float: 'right', margin: 0, transform: 'translate(0.7em, -0.8em)' }}
            hasIconOnly
            iconDescription='Log Popout'
            kind='ghost'
            renderIcon={Popup16}
            onClick={ () => { setLogModalVisible(true) }}
          />
        </h5>
        <br />
        { !logModalVisible &&
          <DataTable
            style={{ overflow: 'hidden' }}
            rows={result.data.logs}
            headers={headers}
            shouldShowBorder={false}
            size='short'
            stickyHeader={true}
            render={({
              rows,
              headers,
              getHeaderProps,
              getTableContainerProps
            }) => (
              <TableContainer
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
        }
        <Modal
          passiveModal
          hasScrollingContent
          size='lg'
          aria-label='Log Modal'
          modalHeading={'Logs'}
          open={logModalVisible}
          onRequestClose={() => setLogModalVisible(false)}
        >
          <DataTable
            rows={result.data.logs}
            headers={headers}
            shouldShowBorder={false}
            size='short'
            stickyHeader={true}
            render={({
              rows,
              headers,
              getHeaderProps,
              getTableContainerProps
            }) => (
              <TableContainer
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
        </Modal>
      </>
    )
  }
}

export default Logs
