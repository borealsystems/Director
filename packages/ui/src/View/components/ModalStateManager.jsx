import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ModalStateManager = ({ LauncherContent, ModalContent }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
      {ModalContent && <ModalContent open={open} setOpen={setOpen} />}
    </>
  )
}

ModalStateManager.propTypes = {
  LauncherContent: PropTypes.any,
  ModalContent: PropTypes.any
}

export default ModalStateManager
