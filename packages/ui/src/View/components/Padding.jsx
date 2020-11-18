import React from 'react'
import PropTypes from 'prop-types'

function Padding ({ size }) {
  const spacingScale = [
    '0.125rem',
    '0.25rem',
    '0.5rem',
    '0.75rem',
    '1rem',
    '1.5rem',
    '2rem',
    '2.5rem',
    '3rem'
  ]
  return <span style={{ display: 'inline-block', height: spacingScale[size - 1] }}>&nbsp;</span>
}

Padding.propTypes = {
  size: PropTypes.number
}

export default Padding
