import 'isomorphic-unfetch'
import './tray'
import { mdnsWatch, mdnsAdvertise } from './network/mdns'
import { updateStreamdecks } from './streamdeck'

updateStreamdecks({ type: 'refresh' })
updateStreamdecks({ type: 'offline' })
mdnsWatch()
mdnsAdvertise()
