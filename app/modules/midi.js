import midi from 'midi'
import { arrayEqual as equal, filterObject } from '../helpers'

const output = new midi.output() // eslint-disable-line
const input = new midi.input() // eslint-disable-line

let devices = []
let openDevices = []
let devicesReferences = {}
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
const checkDeviceListChange = () => {
  const newDeviceList = list()

  if (!equal(devices, newDeviceList)) {
    devices = newDeviceList
    openDevices = openDevices.filter(el => devices.includes(el))
    devicesReferences = filterObject(devicesReferences, (el, key) => openDevices.includes(key))
    changeCallback()
  }

  clearTimeout(checkTimeout)
  checkTimeout = setTimeout(() => process.nextTick(checkDeviceListChange), 1000)
}
checkDeviceListChange()

export const getDevice = name => devicesReferences[name]
export const getDevices = () => devices
export const getOpenDevices = () => openDevices

export const onChange = callback => { changeCallback = () => callback(devices) }

export const open = name => {
  checkDeviceListChange()
  const index = devices.indexOf(name)
  if (index < 0) return null
  const output = new midi.output() // eslint-disable-line
  output.openPort(index)
  openDevices.push(name)
  devicesReferences[name] = output
  process.nextTick(changeCallback)
  return output
}

export const close = name => {
  const device = devicesReferences[name]
  if (device) {
    device.closePort()
    openDevices = openDevices.filter(el => el !== name)
    process.nextTick(changeCallback)
    delete devicesReferences[name]
  }
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
