import React, { useState, useEffect } from 'react'

// eslint-disable-next-line react/prop-types
function Clock ({ tz }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    setTimeout(() => {
      setTime(new Date())
    }, 1000)
  })
  return (
    <p>{time.toLocaleTimeString('en-US', { timeZone: tz })}</p>
  )
}

export default Clock
