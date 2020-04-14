import React from 'react'
import PropTypes from 'prop-types'
import headers from './actionHeaders'
import { DataTable } from 'carbon-components-react'
const { Table, TableContainer, TableExpandHeader, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable

// eslint-disable-next-line no-unused-vars
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
        rows={props.actions}
        headers={headers}
        {...props}
        render={({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getTableContainerProps
        }) => (
          <TableContainer
            {...getTableContainerProps()}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader />
                  {headers.map((header, index) => (
                    <TableHeader key={index} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableExpandRow>
                    <TableExpandedRow
                      colSpan={headers.length + 1}
                      className="demo-expanded-td">
                      <h1 className="demo-inner-container-header">
                        Expandable row content
                      </h1>
                      <p className="demo-inner-container-content">
                        Description here
                      </p>
                    </TableExpandedRow>
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
