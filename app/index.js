import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { toMidi as freqToMidi } from 'tonal-freq'

import './css/index.css'
import App from './components/App'
import reducers from './reducers'
import * as usb from './modules/usb'
import * as midi from './modules/midi'
import { signals as GUITAR_SIGNALS, sampleFrequency } from './constants/guitar'
import guitarInterpreter from './modules/guitarInterpreter'
import { addDevice,
  removeDevice,
  setDevice,
  setMidiDevices,
  setMidiOpenDevices,
  setSignals,
  setSignalsData,
  setOption,
  removeSignalToMidiConnection
} from './actions'

const store = createStore(reducers)

// create frequency detector
const { MacLeod, YIN } = require('node-pitchfinder')
const basePitchOptions = {bufferSize: 2048, sampleRate: sampleFrequency}
let pitchDetector = MacLeod(basePitchOptions)

// ********************************* USB ***************************************
// read devices
usb.getDevices().forEach(device => {
  store.dispatch(addDevice(device))
})

// usb listeners
usb.onAttach(device => store.dispatch(addDevice(device)))
usb.onDetach(device => {
  if (device === store.getState().device) {
    store.dispatch(setSignals([]))
  }
  store.dispatch(removeDevice(device))
})

// *********************************** MIDI ************************************
// set initial state
store.dispatch(setMidiDevices(midi.getDevices()))
store.dispatch(setMidiOpenDevices([]))
// update state
midi.onChange(devices => {
  const openDevices = midi.getOpenDevices()
  store.dispatch(setMidiOpenDevices(openDevices))
  store.dispatch(setMidiDevices(devices.filter(device => !openDevices.includes(device))))
  const connections = store.getState().signalToMidiConnections
  for (let id in connections) {
    if (!openDevices.includes(connections[id].midi)) store.dispatch(removeSignalToMidiConnection(id))
  }
})

const onPitch = (signalId, pitch) => {
  const note = freqToMidi(pitch)
  console.log(note)
}

// ******************************* DATA PROCESSING *****************************
const dataListerner = interpreter => data => {
  try {
    const analysedData = interpreter(data)
    if (analysedData) {
      store.dispatch(setSignalsData(
        GUITAR_SIGNALS.map((signal, i) => ({
          [signal.id]: analysedData[i]
        }))
      ))
      GUITAR_SIGNALS.forEach((signal, i) => {
        const { pitch, probability } = pitchDetector.getResult(analysedData[i].slice(0, 2048))
        if (probability > 0.5 && pitch > 70 && pitch < 1500) onPitch(signal.id, pitch)
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// open device when it changes (and register it's listeners)
store.subscribe(() => {
  let currentDevice = store.getState().device
  // if device changed
  if (usb.getDevice() !== currentDevice) {
    console.log(currentDevice)
    // close the current device
    usb.closeDevice().then(() => {
      // open the new one
      if (usb.openDevice(currentDevice)) {
        store.dispatch(setSignals(GUITAR_SIGNALS))
        usb.onData(dataListerner(guitarInterpreter()))
      } else {
        store.dispatch(setDevice(null))
      }
    }).catch(console.error)
  }
})

// options change listener
let currentOptions = {}
store.subscribe(() => {
  const newOptions = store.getState().options
  // create new pitchDetector if pitch options changed
  if (currentOptions.pitchAlgorithm !== newOptions.pitchAlgorithm ||
      currentOptions[currentOptions.pitchAlgorithm] !== newOptions[newOptions.pitchAlgorithm]) {
    if (newOptions.pitchAlgorithm === 'YIN') {
      pitchDetector = YIN(Object.assign({}, basePitchOptions, newOptions.YIN))
    } else {
      pitchDetector = MacLeod(Object.assign({}, basePitchOptions, newOptions.MacLeod))
    }
  }
  currentOptions = newOptions
})
store.dispatch(setOption('pitchAlgorithm', 'MacLeod'))

store.dispatch(setSignals(GUITAR_SIGNALS))

// store.dispatch(setSignals(GUITAR_SIGNALS))
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
