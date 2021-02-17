import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'urql'

import {
  ComboBox,
  InlineNotification,
  InlineLoading,
  Modal,
  Tag,
  TextInput
} from 'carbon-components-react'
import { Tag16 } from '@carbon/icons-react'

import { updateTagMutationGQL } from './queries'

const TagModal = ({ tagData, render, updateTagsQuery, globalColours }) => {
  const [tag, setTag] = useState({ ...tagData })
  const [tagModalSubmitting, setTagModalSubmitting] = useState(false)
  const [tagModalVisible, setTagModalVisible] = useState(false)
  const openTag = () => setTagModalVisible(true)

  const [tagMutationResult, tagUpdateMutation] = useMutation(updateTagMutationGQL)

  const closeTagModal = () => setTagModalVisibility(false)

  const submitAndCloseTag = () => {
    setTagModalSubmitting(true)
    tagUpdateMutation({ tag: tag })
      .then((response) => {
        setTagModalSubmitting(false)
        if (!response.error) {
          updateTagsQuery()
          setTagModalVisible(false)
        }
      })
  }

  return (
    <>
      { render(openTag) }
      <Modal
        hasForm
        selectorPrimaryFocus='#tagID'
        modalHeading={<>{tag.label} &nbsp;&nbsp;<Tag size='sm' renderIcon={Tag16} style={{ color: 'white', backgroundColor: tag?.colour?.id.concat('E5') ?? '#000000' }}>{tag.label ?? 'New Tag'}</Tag></>}
        primaryButtonText={tagModalSubmitting ? <>Updating Tag <InlineLoading/></> : 'Update Tag'}
        primaryButtonDisabled={tagModalSubmitting || !tag.label || !tag.colour }
        secondaryButtonText='Cancel'
        open={tagModalVisible}
        onRequestClose={closeTagModal}
        onRequestSubmit={submitAndCloseTag}
        onSecondarySubmit={closeTagModal}
      >
        <ComboBox
          ariaLabel='Dropdown'
          id='tagColour'
          titleText='Tag Colour'
          placeholder='Colour'
          items={globalColours}
          selectedItem={tag.colour}
          onChange={(e) => { setTag({ ...tag, colour: e.selectedItem}) }}
        /><br />
        <TextInput
          type='text'
          id='tagID'
          value={tag.id}
          labelText='Tag ID'
          readOnly
        /> <br />
        <TextInput
          type='text'
          id='tagLabel'
          placeholder='A human friendly name.'
          value={tag.label ?? ''}
          labelText='Tag Name'
          required
          onChange={e => { setTag({ ...tag, label: e.target.value.slice(0, 100) }) }}
        />
        { tagMutationResult.error &&
          <InlineNotification
            kind='error'
            title='An error occured during Tag creation'
            subtitle='If this persists, contact your system administrator'
          />
        }
      </Modal>
    </>
  )
}

TagModal.propTypes = {
  realmData: PropTypes.object,
  render: PropTypes.func,
  updateRealmsQuery: PropTypes.func,
  globalColours: PropTypes.array
}

export default TagModal
