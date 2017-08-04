import { combineReducers } from 'redux'

import device from './device'
import devices from './devices'
import signals from './signals'

export default combineReducers({
  device,
  devices,
  signals
})
