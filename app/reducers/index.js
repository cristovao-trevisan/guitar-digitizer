import { combineReducers } from 'redux'

import device from './device'
import devices from './devices'
import signals from './signals'
import signalsData from './signalsData'
import objectReducer from './object'

import { SET_PLOT_PAGE_PROP } from '../constants/action-types'

export default combineReducers({
  device,
  devices,
  signals,
  signalsData,
  plotPage: objectReducer(SET_PLOT_PAGE_PROP)
})
