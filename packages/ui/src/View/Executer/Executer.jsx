import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from 'urql'
import { Grid, Row, Column,  Table, TableBody, TableCell, TableRow, Link, ComboBox, TextInput, NumberInput, Button} from 'carbon-components-react'
import DeviceTile from './DeviceTile.jsx'
import { devicesQueryGQL, deviceFunctionQueryGQL, executeActionMutationGQL } from './queries'
import { arrayChunk, arrayPad } from '../components/arrayUtils'
import ActionParameter from '../Stacks/ActionParameter.jsx'
import globalContext from '../../globalContext'

import noParametersImage from './undraw_No_data_re_kwbl.svg'

function Executer () {
  const { contextRealm } = useContext(globalContext)
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [devicesResult] = useQuery({
    query: devicesQueryGQL,
    variables: { realm: contextRealm.id, core: contextRealm.coreID }
  })
  
  const [selectedDevice, setSelectedDevice] = useState(null)

  const [deviceFunctionResult, executeDeviceFunctionQuery] = useQuery({
    query: deviceFunctionQueryGQL,
    variables: { id: selectedDevice?.id },
    pause: !selectedDevice?.id
  })

  const [deviceFunction, setDeviceFunction] = useState(null)
  const [deviceFilter, setDeviceFilter] = useState('')

  const selectDevice = device => {
    setSelectedDevice(device)
    executeDeviceFunctionQuery()
    setStep(1)
  }

  const setParameter = (value, id) => {
    const parameterArray = [...deviceFunction.parameters]
    if (parameterArray.find(element => element.id === id)) {
      parameterArray.find(element => element.id === id).value = value
      setDeviceFunction({ ...deviceFunction, parameters: parameterArray })
    } else {
      parameterArray.push({ id: id, value: value })
      setDeviceFunction({ ...deviceFunction, parameters: parameterArray })
    }
  }

  const getParameterValue = id => {
    if (deviceFunction.parameters.length === 0) {
      return ''
    } else {
      return deviceFunction.parameters.find(p => p.id === id)?.value || ''
    }
  }

  const [, executeActionMutation] = useMutation(executeActionMutationGQL)


  const executeAction = () => {
    setIsLoading(true)
    const actionPayload = {
      delay: 0,
      device: {
        id: selectedDevice.id,
        label: selectedDevice.label
      },
      providerFunction: {
        id: deviceFunction.id,
        label: deviceFunction.label
      },
      parameters: deviceFunction.parameters?.map(parameter => ({ id: parameter.id, value: parameter.value}))
    }
    executeActionMutation({ action: actionPayload }).then(result => {
      if (result.error) {} 
      else setIsLoading(false)
    })
  }

  return (
    <Grid>
      <Row>
        <Column>
          <h1>Executer</h1>
        </Column>
      </Row><br/>
      <Row>
        <Column>
          { selectedDevice 
            ? <Link onClick={() => { selectDevice(null); setDeviceFunction(null); setStep(0) }}>{selectedDevice?.label}</Link>
            : 'No Device Selected'
          } 
          &nbsp;/&nbsp;
          { deviceFunction
            ? deviceFunction?.label
            : 'No Function Selected'
          }
        </Column>
      </Row>
      <br/>
      { step === 0 && devicesResult.data &&
        <>
          {/* <Row>
            <Column>
              <Search
                labelText='Filter Devices'
                onChange={(e) => setDeviceFilter(e.target.value)}
                placeHolderText='Filter Devices'
              />
            </Column>
          </Row>
          <br />
          <br /> */}
          <Row
            style={{
              maxHeight: '55vh',
              overflowY: 'auto',
            }}
          >
            <Column>
              {arrayChunk(devicesResult.data.devices, 4).map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <Row>
                    {arrayPad(row, 4).map((device, itemIndex) => {
                      return (
                        <Column key={itemIndex}>
                          <DeviceTile onClick={(device) => selectDevice(device)} device={device} selectedDevice={selectedDevice} />
                        </Column>
                      )
                    })}
                  </Row>
                  <br/><br/>
                </React.Fragment>
              ))}
            </Column>
          </Row>
        </>
      }
      { step === 1 && deviceFunctionResult.data && 
        <Row>
          <Column lg={4}>
            <Table>
              <TableBody>
                {deviceFunctionResult.data.deviceFunctions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell onClick={() => setDeviceFunction(row)}>{row.label}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Column>
          <Column lg={1}></Column>
          { deviceFunction &&
            <Column>
              <Row>
                <Column>
                  {((deviceFunction?.parameters && deviceFunction?.parameters.length === 0) || !deviceFunction.parameters) &&
                    <>
                      <Row><img src={noParametersImage} width='40%' style={{ marginTop: '5%', marginLeft: '25%' }}/></Row>
                      <Row>
                        <h3 style={{ marginTop: '10%', width: '100%', textAlign: 'center' }}>{deviceFunction.label} Has No Parameters</h3>
                      </Row>
                    </>
                  }
                  {deviceFunction.parameters?.length > 0 &&
                    <h5>Configure Parameters for {deviceFunction.label}</h5>
                  }
                </Column>
              </Row><br/>
              {deviceFunction.parameters?.length > 0 && deviceFunction.parameters.map((parameter, index) => <ActionParameter key={JSON.stringify(parameter)} parameter={parameter} setParameter={setParameter} getParameterValue={getParameterValue}/>)}
              <Row>
                <Button 
                  style={{ width: "10em", marginLeft: "calc(50% - 5em)", marginTop: '1em' }}
                  onClick={() => executeAction()}
                >
                  Execute
                </Button>
              </Row>
            </Column>
          }
        </Row>
      }
      <br/><br/><br/><br/>
    </Grid>
  )
}

export default Executer
