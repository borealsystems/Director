import React from 'react'
import { Column, ComboBox, Row, TextInput, NumberInput, MultiSelect } from 'carbon-components-react'

const ActionParameter = ({parameter, getParameterValue, setParameter}) => (
  <>
    <Row>
      { parameter.inputType === 'textInput' &&
        <Column>
          <TextInput
            type='text'
            id={parameter.id}
            placeholder={parameter.placeholder}
            labelText={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
            value={getParameterValue(parameter.id)}
            helperText={parameter.tooltip}
            onChange={(e) => { setParameter(e.target.value, parameter.id) }}
          />
        </Column>
      }
      { parameter.inputType === 'textAreaInput' &&
        <Column>
          <TextArea
            ariaLabel='TextAreaInput'
            id={`newDeviceParameter${parameter.id}`}
            placeholder={parameter.placeholder}
            value={getParameterValue(parameter.id)}
            onChange={(e) => { setParameter(e.target.value, parameter.id) }}
            labelText={parameter.label}
          />
        </Column>
      }
      { parameter.inputType === 'comboBox' &&
        <Column>
          <ComboBox
            ariaLabel='Dropdown'
            id={parameter.id}
            titleText={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
            helperText={parameter.tooltip}
            placeholder={parameter.placeholder}
            items={parameter.items}
            selectedItem={getParameterValue(parameter.id)}
            onChange={(e) => { setParameter(e.selectedItem, parameter.id) }}
          />
        </Column>
      }
      { parameter.inputType === 'numberInput' &&
        <Column>
          <NumberInput
            id={parameter.id}
            label={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
            helperText={parameter.tooltip}
            placeholder={parameter.placeholder}
            invalidText={parameter.invalidText ?? 'Input is invalid'}
            value={getParameterValue(parameter.id) || 0}
            onChange={e => !isNaN(e.imaginaryTarget.valueAsNumber) && setParameter(e.imaginaryTarget.valueAsNumber, parameter.id)}
            {...() => (parameter.min && { min: parameter.min })}
            {...() => (parameter.max && { max: parameter.max })}
            />
        </Column>
      }
      { parameter.inputType === 'multiSelect' &&
        <Column>
          <label className='bx--label'>{`${parameter.label} ${parameter.required ? '' : '(optional)'}`}</label>
          <MultiSelect
            id={parameter.id}
            label={`${parameter.label} ${parameter.required ? '' : '(optional)'}`}
            helperText={parameter.tooltip}
            placeholder={parameter.placeholder}
            invalidText={parameter.invalidText ?? 'Input is invalid'}
            initialSelectedItems={getParameterValue(parameter.id) || []}
            items={parameter.items}
            onChange={(e) => { setParameter(e.selectedItems, parameter.id) }}
          />
        </Column>
      }
    </Row>
    <br/>
  </>
)

export default ActionParameter
