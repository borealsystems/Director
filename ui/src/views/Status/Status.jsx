// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Accordion, AccordionItem, Button } from 'carbon-components-react'

// Components
import Log from './components/Log.jsx'
import SystemStatus from './components/SystemStatus.jsx'

class Status extends Component {
  constructor (props) {
    super(props)
    this.state = {
      logs: [
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'warn', subject: 'Stuff\'s not quite right', message: 'The system is loading' },
        { type: 'success', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'error', subject: 'It\'s Broken', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' },
        { type: 'info', subject: 'System Initialisation', message: 'The system is loading' }
      ]
    }
  }

  noRefCheck () {}

  render () {
    return (
      <div>
        <div className='block mt-10'>
          <h1 className="text-xl text-gray-800 dark:text-gray-200 font-bold my-1">System Status</h1>
          <SystemStatus />
        </div>
        <Accordion align="end">
          <AccordionItem
            onClick={function noRefCheck () {}}
            onHeadingClick={function noRefCheck () {}}
            title="Section 1 title"
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </AccordionItem>
          <AccordionItem
            onClick={function noRefCheck () {}}
            onHeadingClick={function noRefCheck () {}}
            title="Section 2 title"
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </AccordionItem>
          <AccordionItem
            onClick={function noRefCheck () {}}
            onHeadingClick={function noRefCheck () {}}
            title="Section 3 title"
          >
            <Button
              disabled={false}
              kind="primary"
              tabIndex={0}
              type="button"
            >
              This is a button.
            </Button>
          </AccordionItem>
          <AccordionItem
            onClick={function noRefCheck () {}}
            onHeadingClick={function noRefCheck () {}}
            title={<span>Section 4 title (<em>the title can be a node</em>)</span>}
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </AccordionItem>
        </Accordion>
        <br /><br />
        <div className='block'>
          <span className="text-xl text-gray-800 dark:text-gray-200 font-bold pb-4">Logs</span>
          <div style={{ height: '45vh' }} className="flex flex-col overflow-y-scroll">
            {this.state.logs.map((key, index) => <Log key={index} type={key.type} subject={key.subject} message={key.message}/>)}
          </div>
        </div>
      </div>
    )
  }
}

export default hot(module)(Status)
