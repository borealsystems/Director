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
        }
      }
    }`,
    variables: { type: type, id: id }
  })

  if (result.fetching) { return <></> }
  if (result.data) {
    const isDeletable = type === 'controller' ? true : result.data.dependents.count === 0
    return (
      <Modal
        danger
        passiveModal={!isDeletable}
        aria-label='Delete Modal'
        modalHeading={isDeletable ? `Deleting ${label} will remove it forever (a very long time), with no way to retrieve it. Do you want to proceed?` : `You cannot delete ${label} because it has ${result.data.dependents.count} dependent object${result.data.dependents.count === 1 ? '.' : 's.'}`}
        modalLabel={`Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        open={open}
        primaryButtonText='Delete'
        secondaryButtonText='Cancel'
        onRequestClose={() => setOpen(false)}
        onRequestSubmit={() => {
          console.log('FUCK IT OFF')
          deleteFunction({ id: id })
            .then(setOpen(false))
            .then(
              setTimeout(refreshFunction(), 1000)
            )
        }}
      />
    )
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
