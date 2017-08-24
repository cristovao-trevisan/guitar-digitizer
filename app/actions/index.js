import * as types from '../constants/action-types'

// devices list
export const addDevice = device => ({
  type: types.ADD_DEVICE,
  device
})

export const removeDevice = device => ({
  type: types.REMOVE_DEVICE,
  device
})

// open device
export const setDevice = device => ({
  type: types.SET_DEVICE,
  device
})

// signals
export const setSignals = signals => ({
  type: types.SET_SIGNALS,
  signals
})

export const clearSignals = {
  type: types.CLEAR_SIGNALS
}

// signals data
export const setSignalsData = signals => ({
  type: types.SET_SIGNALS_DATA,
  signals
})

// plot page props
export const setPlotPageProp = props => ({
  type: types.SET_PLOT_PAGE_PROP,
  props
})

// pitches
export const setPitch = (id, pitch) => ({
  type: types.SET_PITCH,
  props: { [id]: pitch }
})

export const clearPitches = { type: types.CLEAR_PITCHES }

// options
export const setOption = (option, value) => ({
  type: types.SET_OPTION,
  props: { [option]: value }
})

export const clearOptions = { type: types.CLEAR_OPTIONS }

// midi
export const setMidiDevices = devices => ({
  type: types.SET_MIDI_PROP,
  props: { devices }
})

export const setMidiOpenDevices = devices => ({
  type: types.SET_MIDI_PROP,
  props: { openDevices: devices }
})

// signal to midi connections
export const setSignalToMidiConnection = (signal, midi, channel) => ({
  type: types.SET_SIGNAL_TO_MIDI_CONNECTION,
  props: { [signal.id]: { signal, midi, channel } }
})

export const removeSignalToMidiConnection = id => ({
  type: types.REMOVE_SIGNAL_TO_MIDI_CONNECTION,
  props: [id]
})

export const clearSignalToMidiConnections = { type: types.CLEAR_SIGNAL_TO_MIDI_CONNECTIONS }
