import React, { useState, useEffect } from 'react'
import { TooltipDefinition } from 'carbon-components-react'

// eslint-disable-next-line react/prop-types
function Clock ({ tz }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const loop = setTimeout(() => {
      setTime(new Date())
    }, 1000)

    const cleanup = () => {
      clearTimeout(loop)
    }
    return cleanup
  })

  return (
    <TooltipDefinition
      tooltipText="Time synced to Core"
      align='center'
    >
      <p>{time.toLocaleTimeString('en-US', { timeZone: tz })}</p>
    </TooltipDefinition>
  )
}

export default Clock
