import midi from 'midi'
import { arrayEqual as equal } from '../helpers'

const output = new midi.output() // eslint-disable-line
const input = new midi.input() // eslint-disable-line

let devices = []
let openDevices = []
let changeCallback = () => {}

const list = () => {
  const result = []
  const size = output.getPortCount()

  for (let i = 0; i < size; i += 1) {
    result.push(output.getPortName(i))
  }

  return result
}

let checkTimeout
const checkDeviceListChange = (callCallback) => {
  const newDeviceList = list()

  if (!equal(devices, newDeviceList)) {
    devices = newDeviceList
    openDevices.filter(el => devices.includes(el))
    changeCallback(devices)
  }

  clearTimeout(checkTimeout)
  checkTimeout = setTimeout(() => process.nextTick(checkDeviceListChange), 1000)
}
checkDeviceListChange()

export const getDevices = () => devices
export const getOpenDevices = () => openDevices

export const onChange = callback => { changeCallback = callback }

export const open = name => {
  checkDeviceListChange()
  const index = devices.indexOf(name)
  if (index < 0) return null
  const output = new midi.output() // eslint-disable-line
  output.openPort(index)
  openDevices.push(name)
  return output
}

/*
 * Creates loop virtual midi
 * @param {string} name
 */
export const createVirtual = name => {
  const output = new midi.output() // eslint-disable-line
  const input = new midi.input() // eslint-disable-line

  output.openVirtualPort(name)
  // pipe message
  input.on('message', (deltaTime, message) => output.sendMessage(message))
  input.openVirtualPort(name)
}
