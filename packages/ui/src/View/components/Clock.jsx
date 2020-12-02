import React, { useState, useEffect } from 'react'
import { TooltipDefinition } from 'carbon-components-react'

// eslint-disable-next-line react/prop-types
function Clock ({ tz }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const loop = setTimeout(() => {
      setTime(new Date())
    }, 100)

    const cleanup = () => {
      clearTimeout(loop)
    }
    return cleanup
  })

  return (
    <TooltipDefinition
      style={{ paddingLeft: '1.4em', width: '9em', borderBottom: 'none' }}
      className='bx--header__action clock'
      tooltipText='Time synced to Core'
      align='center'
    >
      {time.toLocaleTimeString('en-US', { timeZone: tz })}
    </TooltipDefinition>
  )
}

export default Clock
