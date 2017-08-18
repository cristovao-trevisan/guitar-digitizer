import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import './css/index.css'
import App from './components/App'
import reducers from './reducers'
import * as usb from './modules/usb'
import { addDevice, removeDevice, setDevice, setSignals, setSignalsData } from './actions'
import { signals as GUITAR_SIGNALS, sampleFrequency } from './constants/guitar'
import guitarInterpreter from './modules/guitarInterpreter'

const store = createStore(reducers)

// create frequency detector
const { MacLeod } = require('node-pitchfinder')
let pitchDetector = MacLeod({ bufferSize: 2048, sampleRate: sampleFrequency })

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

// open device when it changes
store.subscribe(() => {
  let currentDevice = store.getState().device
  // if device changed
  if (usb.getDevice() !== currentDevice) {
    // close the current device
    usb.closeDevice().then(() => {
      // open the new one
      if (usb.openDevice(currentDevice)) {
        const interpret = guitarInterpreter()
        // set the signals
        store.dispatch(setSignals(GUITAR_SIGNALS))
        // set the data listener
        usb.onData(data => {
          try {
            let analysedData = interpret(data)
            if (analysedData) {
              store.dispatch(setSignalsData(
                GUITAR_SIGNALS.map((signal, i) => ({
                  [signal.id]: analysedData[i]
                }))
              ))
              GUITAR_SIGNALS.forEach((signal, i) => {
                let pitch = pitchDetector(analysedData[i].slice(0, 2048))
                if (pitch > 70 && pitch < 1500) console.log(pitch)
              })
            }
          } catch (err) {
            console.error(err)
          }
        })
      } else {
        store.dispatch(setDevice(null))
      }
    }).catch(console.error)
  }
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
