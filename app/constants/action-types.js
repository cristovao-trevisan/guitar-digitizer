let actionCounter = 0
// device reducer
export const SET_DEVICE = actionCounter++

// devices reducer
export const ADD_DEVICE = actionCounter++
export const REMOVE_DEVICE = actionCounter++

// signals reducer
export const SET_SIGNALS = actionCounter++
export const CLEAR_SIGNALS = actionCounter++

// signals data reducer
export const SET_SIGNALS_DATA = actionCounter++
// and CLEAR_SIGNALS above

// plot props
export const SET_PLOT_PAGE_PROP = actionCounter++

// pitch reducer
export const SET_PITCH = actionCounter++
export const CLEAR_PITCHES = actionCounter++

// options reducer
export const SET_OPTION = actionCounter++
export const CLEAR_OPTIONS = actionCounter++

export const SET_MIDI_PROP = actionCounter++

// signal to midi connections reducer
export const SET_SIGNAL_TO_MIDI_CONNECTION = actionCounter++
export const REMOVE_SIGNAL_TO_MIDI_CONNECTION = actionCounter++
export const CLEAR_SIGNAL_TO_MIDI_CONNECTIONS = actionCounter++
