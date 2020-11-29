import React from 'react'
import { useQuery } from 'urql'
import PropTypes from 'prop-types'
import { Modal } from 'carbon-components-react'

const DeleteObjectModal = ({ open, setOpen, type, id, label, deleteFunction, refreshFunction }) => {
  const [result] = useQuery({
    query: `query dependents($id: String, $type: String) {
      dependents(type: $type, id: $id) {
        count
        list {
          id
          label
          itemType
        }
      }
    }`,
    variables: { type: type, id: id }
  })

  if (result.fetching) { return <></> }
  if (result.data) {
    const isDeletable = type === 'controller' ? true : result.data.dependents.count === 0
    if (type === 'stack') {
      const panelCount = result.data.dependents.list.filter(item => item.itemType === 'panel').length
      const stackCount = result.data.dependents.list.filter(item => item.itemType === 'stack').length
      return (
        <Modal
          danger
          aria-label='Delete Modal'
          modalHeading={
            isDeletable
              ? `Deleting ${label} will remove it forever (a very long time), with no way to undo it. Are you sure you want to proceed?`
              : `${label} is in use on ${panelCount} panel${panelCount === 1 ? '' : 's'} and within ${stackCount} other stack${stackCount === 1 ? '' : 's'}. Are you sure you absolutely sure you want to do this?`
          }
          modalLabel='Delete Stacks'
          open={open}
          primaryButtonText='Delete'
          secondaryButtonText='Cancel'
          onRequestClose={() => setOpen(false)}
          onRequestSubmit={() => {
            deleteFunction({ id: id })
              .then(() => {
                setOpen(false)
                refreshFunction()
              })
          }}
        >
          {!isDeletable && 'Deleting this Stack will remove it from all panels that use it, and will remove Stack Execute Actions from all other Stacks that reference it.'}
        </Modal>
      )
    } else {
      return (
        <Modal
          danger
          passiveModal={!isDeletable}
          aria-label='Delete Modal'
          modalHeading={isDeletable ? `Deleting ${label} will remove it forever (a very long time), with no way to undo it. Are you sure you want to proceed?` : `You cannot delete ${label} because it has ${result.data.dependents.count} dependent object${result.data.dependents.count === 1 ? '.' : 's.'}`}
          modalLabel={`Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          open={open}
          primaryButtonText='Delete'
          secondaryButtonText='Cancel'
          onRequestClose={() => setOpen(false)}
          onRequestSubmit={() => {
            deleteFunction({ id: id })
              .then(() => {
                setOpen(false)
                refreshFunction()
              })
          }}
        />
      )
    }
  }
}

DeleteObjectModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  deleteFunction: PropTypes.func,
  refreshFunction: PropTypes.func
}

export default DeleteObjectModal
