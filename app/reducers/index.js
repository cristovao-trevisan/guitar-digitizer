import { combineReducers } from 'redux'

import device from './device'
import devices from './devices'
import signals from './signals'
import signalsData from './signalsData'
import objectReducer from './object'

import * as actionTypes from '../constants/action-types'

export default combineReducers({
  device,
  devices,
  signals,
  signalsData,
  plotPage: objectReducer(actionTypes.SET_PLOT_PAGE_PROP),
  pitches: objectReducer(actionTypes.SET_PITCH, actionTypes.CLEAR_PITCHES),
  options: objectReducer(actionTypes.SET_OPTION, actionTypes.CLEAR_OPTIONS),
  /** midi format
   * devices: array of closed devices,
   * openDevices: array of open devices
   */
  midi: objectReducer(actionTypes.SET_MIDI_PROP),
  /** signalToMidiConnections format
   * [signal.id]: {
   *  signal: {
   *    name: string,
   *    id: string
   *  },
   *  midi: string,
   *  channel: number
   * }
   *
   */
  signalToMidiConnections: objectReducer(
    actionTypes.SET_SIGNAL_TO_MIDI_CONNECTION,
    actionTypes.CLEAR_SIGNAL_TO_MIDI_CONNECTIONS,
    actionTypes.REMOVE_SIGNAL_TO_MIDI_CONNECTION
  )
})
