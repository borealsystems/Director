import React from 'react'
import PropTypes from 'prop-types'
import headers from './actionHeaders'
import { DataTable } from 'carbon-components-react'
const { Table, TableContainer, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

const tmp = [
  {
    step: 0,
    device: {
      name: 'PacketSender',
      id: '8KWJDTZ-',
      provider: 'osc',
      __typename: 'Device'
    },
    function: {
      id: 'integer',
      label: 'Send String',
      parameters: [
        {
          label: 'OSC Path',
          id: 'path',
          inputType:
          'textInput',
          regex: null,
          __typename: 'functionParameter'
        },
        {
          label: 'Value',
          id: 'string',
          inputType: 'textInput',
          regex: '^-?\\d+$',
          __typename: 'functionParameter'
        }
      ],
      __typename: 'providerFunction'
    },
    config: {
      path: '/textNode',
      string: 'testString'
    }
  }
]

const StackActions = (props) => {
  return (
    <>
      <DataTable
        isSortable
        rows={props.actions}
        headers={headers}
        render={({ rows, headers, getHeaderProps }) => (
          <TableContainer>
            <Table>
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
                { props.actions && rows.map(row => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableExpandRow>
                    {row.isExpanded && (
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <p>Pretend this works</p>
                      </TableExpandedRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
      <br/>
    </>
  )
}

StackActions.propTypes = {
  actions: PropTypes.any
}

export default StackActions
