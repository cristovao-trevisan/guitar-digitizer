import * as types from '../constants/action-types'

export const addDevice = device => ({
  type: types.ADD_DEVICE,
  device
})

export const removeDevice = device => ({
  type: types.REMOVE_DEVICE,
  device
})

export const setDevice = device => ({
  type: types.SET_DEVICE,
  device
})

export const setSignals = signals => ({
  type: types.SET_SIGNALS,
  signals
})

export const setSignalsData = signals => ({
  type: types.SET_SIGNALS_DATA,
  signals
})

export const setPlotPageProp = props => ({
  type: types.SET_PLOT_PAGE_PROP,
  props
})

export const setPitch = (id, pitch) => ({
  type: types.SET_PITCH,
  props: { [id]: pitch }
})

export const clearPitches = { type: types.CLEAR_PITCHES }

export const setOption = (option, value) => ({
  type: types.SET_OPTION,
  props: { [option]: value }
})

export const clearOptions = { type: types.CLEAR_OPTIONS }
