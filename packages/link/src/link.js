import 'isomorphic-unfetch'
import './tray'
import { mdnsWatch, mdnsAdvertise } from './network/mdns'
import { initStreamDecks } from './streamdeck'

initStreamDecks()
mdnsWatch()
mdnsAdvertise()
