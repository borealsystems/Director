import React, { useState } from 'react'
import { hot } from 'react-hot-loader'

const colour = (index) => {
  return index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'
}

const toggleProps = (showProperties, setShowProperties) => {
  // e.preventDefault()
  setShowProperties(!showProperties)
}

const Device = (props) => {
  const [showProperties, setShowProperties] = useState(false)
  return (
    <div key={props.index} className={colour(props.index)}>
      <div className="text-center">
        <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">{props.device.name}</div>
        <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{props.device.uuid}</div>
        <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
          {showProperties ? (
            <button className="text-xs text-gray-500 uppercase" onClick={() => toggleProps(showProperties, setShowProperties)}>Less {'<'}</button>
          ) : (
            <button className="text-xs text-gray-500 uppercase" onClick={() => toggleProps(showProperties, setShowProperties)}>More ></button>
          )}
        </div>
      </div>
      {showProperties &&
      <div className="w-100 h-64 py-2 px-2 border-l border-r border-t border-gray-500">
        <span>UUID: {props.device.uuid} </span><br/>
        <span>Name: {props.device.name} </span><br/>
        <span>Definition: {props.device.definition} </span><br/>
        <span>Config: {JSON.stringify(props.device.config)}</span>
      </div>
      }
    </div>
  )
}

// class Device extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       showProperties: false
//     }
//   }

//   colour () {
//     return this.props.index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
//   }

//   onClick (e) {
//     e.preventDefault()
//     this.setState({ showProperties: !this.state.showProperties })
//   }

//   render () {
//     return (
//       <div key={this.props.index} className={this.colour()}>
//         <div className="text-center">
//           <div className="inline-block w-3/6 h-10 py-2 px-2 border-t border-l border-gray-500">{this.props.device.name}</div>
//           <div className="inline-block w-1/3 h-10 py-2 px-2 border-t border-l border-gray-500">{this.props.device.uuid}</div>
//           <div className="inline-block w-1/6 h-10 py-2 px-2 border-t border-l border-r border-gray-500">
//             {this.state.showProperties ? (
//               <button className="text-xs text-gray-500 uppercase" onClick={this.onClick.bind(this)}>Less {'<'}</button>
//             ) : (
//               <button className="text-xs text-gray-500 uppercase" onClick={this.onClick.bind(this)}>More ></button>
//             )}
//           </div>
//         </div>
//         {this.state.showProperties &&
//         <div className="w-100 h-64 py-2 px-2 border-l border-r border-t border-gray-500">
//           <span>UUID: {this.props.device.uuid} </span><br/>
//           <span>Name: {this.props.device.name} </span><br/>
//           <span>Definition: {this.props.device.definition} </span><br/>
//           <span>Config: {JSON.stringify(this.props.device.config)}</span>
//         </div>
//         }
//       </div>
//     )
//   }
// }

export default hot(module)(Device)
