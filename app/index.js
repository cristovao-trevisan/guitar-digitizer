import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import './css/index.css'
import App from './components/App'
import reducers from './reducers'
import * as usb from './modules/usb'
import * as midi from './modules/midi'
import { signals as GUITAR_SIGNALS, sampleFrequency } from './constants/guitar'
import { interpreter as guitarInterpreter, processor as guitarProcessor } from './modules/guitarSignalProcessor'
import { addDevice,
  removeDevice,
  setDevice,
  setMidiDevices,
  setMidiOpenDevices,
  setSignals,
  clearSignals,
  setSignalsData,
  setOption,
  removeSignalToMidiConnection,
  clearSignalToMidiConnections
} from './actions'

const store = createStore(reducers)

// create frequency detector
const { MacLeod, YIN } = require('node-pitchfinder')
let pitchDetector = () => {}

// ********************************* USB ***************************************
// read devices
usb.getDevices().forEach(device => {
  store.dispatch(addDevice(device))
})

// usb listeners
usb.onAttach(device => store.dispatch(addDevice(device)))
usb.onDetach(device => {
  if (device === store.getState().device) {
    store.dispatch(clearSignals)
    store.dispatch(clearSignalToMidiConnections)
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

// ******************************* DATA PROCESSING *****************************
const noteOn = (channel, note, velocity) => [0b10010000 | channel, parseInt(note), parseInt(velocity)]
const onNoteOn = (id, note, velocity) => {
  console.log('Note on, id: ' + id + ', note: ' + note)
  const connection = store.getState().signalToMidiConnections[id]
  if (connection) {
    const device = midi.getDevice(connection.midi)
    device.sendMessage(noteOn(connection.channel, note, velocity))
  }
}

const noteOff = (channel, note, velocity) => [0b10000000 | channel, parseInt(note), parseInt(velocity)]
const onNoteOff = (id, note, velocity) => {
  console.log('Note off, id: ' + id + ', note: ' + note)
  const connection = store.getState().signalToMidiConnections[id]
  if (connection) {
    const device = midi.getDevice(connection.midi)
    device.sendMessage(noteOff(connection.channel, note, 0x10))
  }
}

const dataListener = () => {
  const interpreter = guitarInterpreter()
  const processor = guitarProcessor(onNoteOn, onNoteOff, () => pitchDetector)

  return data => {
    try {
      const analysedData = interpreter(data)
      if (analysedData) {
        store.dispatch(setSignalsData(
          GUITAR_SIGNALS.map((signal, i) => ({
            [signal.id]: analysedData[i]
          }))
        ))
        try {
          processor(analysedData)
        } catch (err) {
          console.error(err)
        }
      }
    } catch (err) {
      console.error(err)
    }
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
        usb.onData(dataListener())
      } else {
        store.dispatch(setDevice(null))
      }
    }).catch(console.error)
  }
})

// options change listener
const basePitchOptions = {bufferSize: 2048, sampleRate: sampleFrequency}
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
store.dispatch(setOption('MacLeod', { cutoff: 0.85, probabilityThreshold: 0.7 }))
store.dispatch(setOption('YIN', { threshold: 0.3, probabilityThreshold: 0.7 }))
// store.dispatch(setSignals(GUITAR_SIGNALS))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
