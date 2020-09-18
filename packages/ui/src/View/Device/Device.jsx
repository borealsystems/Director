import React, { useState } from 'react'
import { Button, ButtonSet, ComboBox, TextInput, Form, FormGroup, ProgressIndicator, ProgressStep, Grid, Row, Column, DropdownSkeleton, InlineLoading, InlineNotification, Loading } from 'carbon-components-react'
import { useMutation } from 'urql'
import { omit } from 'lodash'
import { ArrowRight24, Exit24, ArrowLeft24 } from '@carbon/icons-react'
import { useHistory } from 'react-router-dom'

import { deviceMutationGQL } from './queries'

const Device = ({ id, result }) => {
  const isNew = id === 'new'
  const [deviceUpdateMutationResult, deviceUpdateMutation] = useMutation(deviceMutationGQL)

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
  const [configurationStep, setConfigurationStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [invalid, setInvalid] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const updateDevice = () => {
    return new Promise((resolve, reject) => {
      const conf = []
      for (var key of Object.keys(configuration)) {
        conf.push(configuration[key])
      }
      const deviceUpdateObject = { device: { ...device, configuration: conf, provider: { id: device.provider.id, label: device.provider.label }, enabled: false, status: 'error' } }
      console.log(JSON.stringify(deviceUpdateObject))
      deviceUpdateMutation(deviceUpdateObject).then(resolve(deviceUpdateMutationResult)).catch(e => reject(e))
    })
  }

  const validate = () => {
    let errors = {}
    let invalid = {}
    switch (configurationStep) {
      case 0:
        if (!device.label) {
          errors = { ...errors, label: 'Please enter a device name' }
          invalid = { ...invalid, label: true }
        } else if (invalid.label) {
          delete invalid.label
        }
        if (!device.provider) {
          errors = { ...errors, provider: 'Please select a provider' }
          invalid = { ...invalid, provider: true }
        } else if (invalid.provider) {
          delete invalid.provider
        }
        setErrors(errors)
        setInvalid(invalid)
        if (Object.keys(invalid).length === 0) {
          setConfigurationStep(configurationStep + 1)
        }
        break

      case 1:
        setIsLoading(true)
        updateDevice().then(() => {
          if (!deviceUpdateMutationResult.error) {
            setIsLoading(false)
            history.push({ pathname: './' })
          }
        })
        break
    }
  }

  const getProvider = (providerID) => {
    return result.data.providers.find(provider => provider.id === providerID)
  }
  if (result.fetching) { return <Loading /> }
  if (result.data) {
    return (
      <Form>
        <Grid>
          <Row>
            <Column>
              <h1>{ id === 'new' ? 'New Device' : device.label }</h1><br/>
            </Column>
          </Row>
          <Row>
            <Column>
              <ProgressIndicator
                vertical={false}
                currentIndex={configurationStep}
                spaceEqually={true}>
                <ProgressStep
                  label='Device Information'
                />
                <ProgressStep
                  label="Device Configuration"
                />
              </ProgressIndicator>
            </Column>
          </Row><br/>
          { configurationStep === 0 &&
              <FormGroup legendText=''>
                <Row>
                  <Column>
                    <TextInput
                      type='text'
                      invalid={invalid?.label}
                      invalidText={errors?.label}
                      id='deviceLabel'
                      placeholder='What is this device called?'
                      value={device.label}
                      labelText='Device Name (required)'
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
                {result.fetching &&
                  <DropdownSkeleton />
                }
                { result.data &&
                  <ComboBox
                    ariaLabel="Dropdown"
                    id="newDeviceProvider"
                    disabled={!isNew}
                    invalid={invalid?.provider}
                    invalidText={errors?.provider}
                    placeholder='What type of device is this?'
                    items={result.data.providers.filter(provider => provider.id !== 'BorealSystems-DirectorInternal')}
                    selectedItem={device.provider}
                    onChange={(provider) => { setDevice({ ...device, provider: provider.selectedItem }) }}
                    titleText="Device Provider (required)"
                  />
                }
              </FormGroup>
          }
          { configurationStep === 1 &&
              <FormGroup legendText=''>
                <InlineNotification
                  style={{ width: '100%' }}
                  lowContrast={true}
                  kind='warning'
                  title='Unfinished Interface'
                  subtitle='This page does not have input validation yet'
                  hideCloseButton={true}
                />
                { device.provider && getProvider(device.provider.id).parameters.map((item, index) =>
                  <React.Fragment key={index}>
                    <Row>
                      <Column>
                        <TextInput
                          type='text'
                          id={`newDeviceParameter${item.id}`}
                          placeholder={ `What is this devices ${item.label.toLowerCase()}?` }
                          labelText={ `${item.label} (${item.required ? 'required' : 'optional'})` }
                          value={configuration[item.id] ? configuration[item.id].value : ''}
                          onClick={() => {}}
                          onChange={(e) => { setConfiguration({ ...configuration, [item.id]: { id: item.id, value: e.target.value } }) }}
                        />
                      </Column>
                    </Row>
                    <br/>
                  </React.Fragment>
                )}
              </FormGroup>
          }
          <Row>
            <Column style={{ marginLeft: '64.4%' }}>
              <ButtonSet>
                <Button renderIcon={ configurationStep === 0 ? Exit24 : ArrowLeft24} onClick={() => { configurationStep === 0 ? history.push({ pathname: './' }) : setConfigurationStep(configurationStep - 1) }} size='default' kind="secondary">
                  { configurationStep === 0 ? 'Cancel' : 'Go Back' }
                </Button>
                  &nbsp;
                { isLoading
                  ? <InlineLoading description='Creating Device' status='active' />
                  : <Button renderIcon={ArrowRight24} onClick={() => { validate() }} size='default' kind="primary">
                    { configurationStep === 0 ? 'Continue' : isNew ? 'Create Device' : 'Update Device' }
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
