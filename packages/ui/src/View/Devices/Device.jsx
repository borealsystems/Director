import React, { useState, useContext } from 'react'
import {
  Button,
  ButtonSet,
  TextInput,
  Form,
  FormGroup,
  ProgressIndicator,
  ProgressStep,
  Grid,
  Row,
  Column,
  InlineLoading,
  Loading,
  ComboBox,
  Search,
  NumberInput
} from 'carbon-components-react'
import { useMutation } from 'urql'
import { omit } from 'lodash'
import { ArrowRight24, Exit24, ArrowLeft24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'

import { deviceMutationGQL } from './queries'

import globalContext from '../../globalContext'
import STATUS from '../statusEnum'
import ProviderTile from './ProviderTile.jsx'

const Device = ({ id, result }) => {
  const { contextRealm } = useContext(globalContext)
  const isNew = id === 'new'
  const [, deviceUpdateMutation] = useMutation(deviceMutationGQL)

  const initialDevice = isNew ? {} : result.data.device
  const initialConfiguration = {}

  if (!isNew && initialDevice.configuration) {
    initialDevice.configuration.forEach(item => {
      initialConfiguration[item.id] = item
    })
  }

  const history = useHistory()

  const [device, setDevice] = useState(omit(initialDevice, 'configuration'))
  const [configuration, setConfiguration] = useState(initialConfiguration)
  const [configurationStep, setConfigurationStep] = useState(isNew ? 0 : 1)
  const [isLoading, setIsLoading] = useState(false)

  const updateDevice = () => {
    setIsLoading(true)
    const conf = []
    for (var key of Object.keys(configuration)) {
      conf.push(configuration[key])
    }
    const deviceUpdateObject = { device: { ...device, configuration: conf, status: STATUS.UNKNOWN, core: contextRealm.coreID, realm: contextRealm.id, provider: { id: device.provider.id } } }
    deviceUpdateMutation(deviceUpdateObject)
      .then(result => {
        if (result.error) {
          console.log(result.error)
          setIsLoading(false)
        }
        if (result.data) {
          setIsLoading(false)
          history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices` })
        }
      })
  }

  const [filter, setFilter] = useState(null)
  const [mfgFilter, setMfgFilter] = useState(null)

  const arrayChunk = (array, chunkSize) => {
    var R = []
    for (var i = 0; i < array.length; i += chunkSize) {
      R.push(array.slice(i, i + chunkSize))
    }
    return R
  }

  const padRow = (row, pad) => {
    var padding = []
    var padsToAdd = pad - row.length
    for (var i = 0; i < padsToAdd; i++) {
      padding.push({ isPadding: true })
    }
    return row.concat(padding)
  }

  if (result.fetching) { return <Loading /> }
  if (result.data) {
    const providers = result.data.providers.filter(e => e.id !== 'ProtocolProviderBorealDirector')

    const filteredMfgData = providers.filter((e) =>
      mfgFilter === null
        ? e
        : e.manufacturer === mfgFilter
    )

    const filteredProviderData = filteredMfgData.filter((e) => {
      return filter === null
        ? e
        : e.label.toLowerCase().includes(filter.toLowerCase()) ||
          e.protocol.toLowerCase().includes(filter.toLowerCase()) ||
          e.manufacturer?.toLowerCase().includes(filter.toLowerCase()) ||
          e.description?.toLowerCase().includes(filter.toLowerCase())
    })

    return (
      <Form>
        <Grid>
          <Row>
            <Column>
              <h1>{ id === 'new' ? 'New Device' : device.label }</h1><br/>
            </Column>
          </Row><br/>
          { isNew &&
            <>
              <Row>
                <Column>
                  <ProgressIndicator
                    vertical={false}
                    currentIndex={configurationStep}
                    spaceEqually={true}>
                    <ProgressStep
                      label='Device Provider'
                    />
                    <ProgressStep
                      label='Device Configuration'
                    />
                  </ProgressIndicator>
                </Column>
              </Row>
              <br/><br/>
            </>
          }
          { configurationStep === 0 &&
            <>
              <Row>
                <Column sm={1} style={{ marginRight: '-1em' }}>
                  <ComboBox
                    id='newDeviceProviderFilterManufacturerComboBox'
                    size='xl'
                    placeholder='Filter Manufacturer'
                    items={[...new Set(
                      providers.map((p) => p.manufacturer)
                    )]}
                    onChange={(e) => {
                      console.log(e)
                      setMfgFilter(e.selectedItem)
                    }}
                  />
                </Column>
                <Column style={{ marginLeft: '-1em' }}>
                  <Search
                    labelText='Filter Providers'
                    onChange={(e) => setFilter(e.target.value)}
                    placeHolderText='Filter Providers'
                  />
                </Column>
              </Row>
              <br />
              <br />
              <Row
                style={{
                  maxHeight: '55vh',
                  overflowY: 'scroll',
                  marginRight: '-2.2em'
                }}
              >
                <Column>
                  {arrayChunk(filteredProviderData, 3).map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <Row>
                        {padRow(row, 3).map((item, itemIndex) => {
                          return (
                            <Column key={itemIndex}>
                              <ProviderTile onClick={(provider) => setDevice({ ...device, provider: provider })} currentDevice={device} providerDescription={item} />
                            </Column>
                          )
                        })}
                      </Row>
                      <br />
                      <br />
                    </React.Fragment>
                  ))}
                </Column>
              </Row>
            </>
          }
          { configurationStep === 1 &&
            <>
              <FormGroup legendText='General Configuration'>
                <Row>
                  <Column>
                    <TextInput
                      type='text'
                      id='deviceLabel'
                      placeholder='What is this device called?'
                      value={device.label ?? ''}
                      labelText='Device Name'
                      onClick={() => {}}
                      onChange={(e) => { setDevice({ ...device, label: e.target.value }) }}
                    /><br/>
                  </Column>
                  <Column>
                    <TextInput
                      type='text'
                      id='deviceLocation'
                      placeholder='Where is this device in your facility?'
                      value={device.location || undefined}
                      labelText='Device Location (optional)'
                      onClick={() => {}}
                      onChange={(e) => { setDevice({ ...device, location: e.target.value }) }}
                    /><br/>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <TextInput
                      type='text'
                      id='deviceDescription'
                      placeholder='What is the purpose of this device?'
                      value={device.description || undefined}
                      labelText='Device Decription (optional)'
                      onClick={() => {}}
                      onChange={(e) => { setDevice({ ...device, description: e.target.value }) }}
                    /><br/>
                  </Column>
                </Row>
              </FormGroup>
              <FormGroup legendText='Connection Configuration'>
                <Row>
                  <Column style={{ width: '33%', maxWidth: '33%' }}>
                    <ProviderTile disabled currentDevice={device} providerDescription={device.provider} />
                  </Column>
                  <Column>
                    { device.provider && device.provider.parameters.map((item, index) =>
                      <React.Fragment key={index}>
                        <Row>
                          { item.inputType === 'textInput' &&
                            <Column>
                              <TextInput
                                type='text'
                                id={`newDeviceParameter${item.id}`}
                                invalid={configuration[item.id] && !RegExp(item.regex).test(configuration[item.id].value)}
                                invalidText={`Please enter a valid ${item.label}`}
                                placeholder={item.placeholder}
                                helperText={item.tooltip}
                                labelText={ `${item.label} ${item.required ? '' : '(optional)'}` }
                                value={configuration[item.id] ? configuration[item.id].value : (device.provider?.defaults?.[index] ?? '')}
                                onChange={(e) => { setConfiguration({ ...configuration, [item.id]: { id: item.id, value: e.target.value } }) }}
                              />
                            </Column>
                          }
                          { item.inputType === 'numberInput' &&
                            <Column>
                              <NumberInput
                                id={`newDeviceParameter${item.id}`}
                                invalidText={`Please enter a valid ${item.label}`}
                                label={ `${item.label} ${item.required ? '' : '(optional)'}` }
                                helperText={item.tooltip}
                                value={configuration[item.id] ? configuration[item.id].value : (device.provider?.defaults?.[index] ?? 0)}
                                onChange={e => !isNaN(e.imaginaryTarget.valueAsNumber) && setConfiguration({ ...configuration, [item.id]: { id: item.id, value: e.imaginaryTarget.valueAsNumber } })}
                                min={0}
                                max={65535}
                                step={10}
                              />
                            </Column>
                          }
                          { item.inputType === 'comboBox' &&
                            <Column>
                              <ComboBox
                                ariaLabel='Dropdown'
                                id={`newDeviceParameter${item.id}`}
                                placeholder={item.placeholder}
                                items={item.items}
                                value={configuration[item.id] ? configuration[item.id].value : (device.provider?.defaults?.[index] ?? 0)}
                                onChange={(e) => { setConfiguration({ ...configuration, [item.id]: { id: item.id, value: e.selectedItem } }) }}
                                titleText={item.label}
                              />
                            </Column>
                          }
                          { (item.inputType !== 'textInput' && item.inputType !== 'numberInput' && item.inputType !== 'comboBox') &&
                            <Column>
                              This Provider has input types ({item.id}: {item.inputType ?? 'null'}) this version of Core cannot configure, please open an issue for this provider.
                            </Column>
                          }
                        </Row>
                        <br/>
                      </React.Fragment>
                    )}
                  </Column>
                </Row>
              </FormGroup>
            </>
          }
          <br/><br/>
          <Row>
            <Column>
              { configurationStep === 0 && device.provider &&
                <h5>
                  Selected Provider: {device.provider.label}
                </h5>
              }
            </Column>
            <Column>
              <ButtonSet style={{ float: 'right', marginRight: '0' }}>
                <Button
                  renderIcon={ configurationStep === 0 ? Exit24 : ArrowLeft24}
                  onClick={() => { configurationStep === 0 ? history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices` }) : isNew ? setConfigurationStep(configurationStep - 1) : history.push({ pathname: `/cores/${contextRealm.coreID}/realms/${contextRealm.id}/config/devices` }) }}
                  size='default'
                  kind='secondary'
                  style={{ width: '18em' }}
                >
                  { configurationStep === 0 ? 'Cancel' : 'Go Back' }
                </Button>
                { configurationStep === 0
                  ? <Button style={{ width: '18em' }} disabled={!device.provider} renderIcon={ArrowRight24} onClick={() => { setConfigurationStep(1) }} size='default' kind='primary'>
                    Continue
                  </Button>
                  : <Button style={{ width: '18em' }} disabled={!device.label} renderIcon={ArrowRight24} onClick={() => { updateDevice() }} size='default' kind='primary'>
                    { isNew && !isLoading ? 'Create Device' : 'Update Device' }
                    { isLoading && <InlineLoading/> }
                  </Button>
                }
              </ButtonSet>
            </Column>
          </Row>
        </Grid>
      </Form>
    )
  }
}

export default Device
