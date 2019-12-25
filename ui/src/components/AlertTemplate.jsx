import React from 'react'
import { hot } from 'react-hot-loader'

const AlertTemplate = ({ style, options, message, close }) => {
  const getStyle = () => {
    const baseClass = 'flex-1 absolute bottom-0 w-56 text-gray-900 h-40 mb-4 p-2 rounded-r-lg shadow-lg dark:shadow-none'
    if (options.type === 'info') {
      style = baseClass + ' bg-blue-400'
    } else if (options.type === 'success') {
      style = baseClass + ' bg-green-400'
    } else if (options.type === 'error') {
      style = baseClass + ' bg-red-400'
    }

    return style
  }

  return (
    <div className={getStyle()}>
      <div className="pl-2">
        <span className="text-lg">
          {message.title}
        </span><br/>
        <span className="text-sm">
          {message.content}
        </span>
      </div>
    </div>
  )
}

export default hot(module)(AlertTemplate)
