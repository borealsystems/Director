import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { useHistory } from 'react-router-dom'
import { Button, DataTable, DataTableSkeleton, Checkbox, OverflowMenu, OverflowMenuItem, Pagination, Modal, TooltipDefinition } from 'carbon-components-react'
import { Add24, CheckmarkOutline24, Error24, InProgress24, Unknown24, WarningAlt24 } from '@carbon/icons-react'
import { devicesQueryGQL, deleteDeviceGQL, enableDeviceMutationGQL, disableDeviceMutationGQL } from './queries'
import GraphQLError from '../components/GraphQLError.jsx'
import ModalStateManager from '../components/ModalStateManager.jsx'
import globalContext from '../../globalContext'
import headers from './headers'
import DeleteObjectModal from '../components/DeleteObjectModal.jsx'

const { Table, TableContainer, TableHead, TableHeader, TableRow, TableBody, TableCell, TableToolbar, TableToolbarContent, TableToolbarSearch } = DataTable

const Devices = () => {
  const { contextRealm } = useContext(globalContext)
  const [result, refresh] = useQuery({
    query: devicesQueryGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })

  const [, deleteDeviceMutation] = useMutation(deleteDeviceGQL)
  const [, enableDeviceMutation] = useMutation(enableDeviceMutationGQL)
  const [, disableDeviceMutation] = useMutation(disableDeviceMutationGQL)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')

  const history = useHistory()

  const STATUS = {
    UNKNOWN: 'UNKNOWN',
    CLOSED: 'Disconnected',
    OK: 'OK',
    CONNECTING: 'Connecting',
    ERROR: 'Error',
    WARNING: 'Warning'
  }

  const getStatusCellContent = value => {
    switch (value) {
      case STATUS.UNKNOWN:
        return <TooltipDefinition direction='top' tooltipText='Status Unknown'><Unknown24/></TooltipDefinition>
      case STATUS.CLOSED:
        return <TooltipDefinition direction='top' tooltipText='Device Disconnected'><Error24/></TooltipDefinition>
      case STATUS.OK:
        return <TooltipDefinition direction='top' tooltipText='Device OK'><CheckmarkOutline24/></TooltipDefinition>
      case STATUS.CONNECTING:
        return <TooltipDefinition direction='top' tooltipText='Device Connecting'><InProgress24/></TooltipDefinition>
      case STATUS.ERROR:
        return <TooltipDefinition direction='top' tooltipText='Device Has Errors'><Error24/></TooltipDefinition>
      case STATUS.WARNING:
        return <TooltipDefinition direction='top' tooltipText='Device Has Warnings'><WarningAlt24/></TooltipDefinition>
    }
  }

  if (result.error) return <GraphQLError error={result.error} />
  if (result.fetching) return <DataTableSkeleton headers={headers} />
  if (result.data) {
    const rawData = result.data.devices
    const filteredTableData = rawData.filter(e => {
      return filter === ''
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
         e.id.toLowerCase().includes(filter.toLowerCase()) ||
         e.location?.toLowerCase().includes(filter.toLowerCase())
    })

    const currentTableData = Array(Math.ceil(rawData.length / pageSize)).fill()
      .map((_, index) => index * pageSize)
      .map(begin => filteredTableData
        .slice(begin, begin + pageSize)
      )[page - 1]

    return (
      <div>
        <DataTable
          rows={currentTableData.map(device => ({ providerLabel: device.provider.label, ...device })) ?? []}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getToolbarProps,
            getTableContainerProps
          }) => (
            <TableContainer
              title="Devices"
              description="Devices are a piece of hardware or software configured to be controlled by BorealDirector."
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(e) => setFilter(e.target.value)} />
                  <Button renderIcon={Add24} onClick={() => { history.push({ pathname: 'devices/new' }) }}>New Device</Button>
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
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'enabled') {
                          return (
                            <TableCell
                              key={cell.id}
                              id={cell.id}
                              className={`la-${cell.info.header}`}>
                              <Checkbox
                                id={'check-' + cell.id}
                                checked={cell.value}
                                hideLabel
                                disabled
                                labelText="checkbox"
                              />
                            </TableCell>
                          )
                        } else if (cell.info.header === 'status') {
                          return (
                            <TableCell
                              key={cell.id}
                              id={cell.id}
                              className={`la-${cell.info.header}`}>
                              {row.cells[5].value ? getStatusCellContent(cell.value) : null}
                            </TableCell>
                          )
                        } else {
                          return <TableCell key={cell.id}>{cell.value}</TableCell>
                        }
                      })}
                      <TableCell>
                        { !row.cells[0].value.match(/CORE-/) &&
                          <OverflowMenu flipped>
                            <OverflowMenuItem itemText='Edit Device' onClick={() => history.push({ pathname: `devices/${row.cells[0].value}` })} />
                            <ModalStateManager
                              LauncherContent={({ setOpen }) => (
                                <OverflowMenuItem itemText={row.cells[5].value ? 'Disable Device' : 'Enable Device'} onClick={() => {
                                  row.cells[5].value
                                    ? setOpen(true)
                                    : enableDeviceMutation({ id: row.cells[0].value }).then(() => setTimeout(refresh, 500))
                                }} />
                              )}
                              disableDeviceMutation
                              ModalContent={({ open, setOpen }) => (
                                <Modal
                                  aria-label='Disable Modal'
                                  modalHeading={`Are you sure you want to disable ${row.cells[1].value}`}
                                  modalLabel='Disable Device'
                                  open={open}
                                  primaryButtonText='Disable'
                                  secondaryButtonText='Cancel'
                                  onRequestClose={() => setOpen(false)}
                                  onRequestSubmit={() => {
                                    disableDeviceMutation({ id: row.cells[0].value })
                                      .then(() => {
                                        setOpen(false)
                                        setTimeout(refresh, 500)
                                      })
                                  }}
                                >
                                  Disabling this device means that Director will not attempt to connect to it or send any commands.<br/>
                                  Any Stack Actions involving this device will remain but they will be skipped when executed.<br/>
                                  You will also not be able to create any new stacks using this device as there is no way to retrieve action data from an offline device.
                                </Modal>
                              )} />
                            <ModalStateManager
                              LauncherContent={({ setOpen }) => (
                                <OverflowMenuItem itemText='Delete Device' isDelete onClick={() => setOpen(true)} />
                              )}
                              ModalContent={({ open, setOpen }) => (
                                <DeleteObjectModal
                                  open={open}
                                  setOpen={setOpen}
                                  type='device'
                                  id={row.cells[0].value}
                                  label={row.cells[1].value}
                                  deleteFunction={deleteDeviceMutation}
                                  refreshFunction={refresh}
                                />
                              )} />
                          </OverflowMenu>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                style={{ width: '100%' }}
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageNumberText="Page Number"
                pageSize={pageSize}
                pageSizes={[10, 25, 50, 100]}
                totalItems={filteredTableData.length}
                onChange={(e) => {
                  setPage(e.page)
                  setPageSize(e.pageSize)
                }}
              />
            </TableContainer>
          )}
        />
      </div>
    )
  }
}

export default Devices
