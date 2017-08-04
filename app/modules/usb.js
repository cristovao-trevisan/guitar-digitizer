import { remote } from 'electron'

const usb = remote.getGlobal('usb')

const VENDOR_ID = 0xf347
const PRODUCT_ID = 0x666f

let device

export const getDevices = () => {
  return usb.getDeviceList().filter(device => {
    return true
    const {idVendor, idProduct} = device.deviceDescriptor
    return idVendor === VENDOR_ID && idProduct === PRODUCT_ID
  })
}

export const openDevice = (dev) => {
  if (device) return false
  device.open()
  const interf = device.interface(1)
  if (!interf) return false
  if (device.isKernelDriverActive()) device.detachKernelDriver()
  interf.claim()
  const endpoint = interf.endpoint(0x81)
  if (!endpoint) return false
  device = { dev, interface: interf, endpoint }
  return true
}

export const onData = (cb) => {
  if (!device) return false
  device.endpoint.startPoll(5, 4096 * 4)
  device.endpoint.on('data', cb)
}

export const closeDevice = () => {
  return new Promise((resolve, reject) => {
    device.interface.release(true, (err) => {
      if (err) reject(err)
      else {
        device.close()
        resolve()
      }
    })
  })
}

export const onAttach = (cb) => usb.on('attach', cb)

export const onDetach = (cb) => usb.on('detach', cb)
