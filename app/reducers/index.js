import { combineReducers } from 'redux'

import device from './device'
import devices from './devices'
import signals from './signals'
import signalsData from './signalsData'
import objectReducer from './object'

import { SET_PLOT_PAGE_PROP, SET_PITCH, CLEAR_PITCHES, SET_OPTION, CLEAR_OPTIONS } from '../constants/action-types'

export default combineReducers({
  device,
  devices,
  signals,
  signalsData,
  plotPage: objectReducer(SET_PLOT_PAGE_PROP),
  pitches: objectReducer(SET_PITCH, CLEAR_PITCHES),
  options: objectReducer(SET_OPTION, CLEAR_OPTIONS)
})
