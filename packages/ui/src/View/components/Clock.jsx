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
    // <h5>{time.getHours()}:{(time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())}:{(time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())} {time.getTimezoneOffset() / 60}</h5>
    <p>{time.toLocaleTimeString('en-US', { timeZone: tz })}</p>
  )
}

export default Clock
