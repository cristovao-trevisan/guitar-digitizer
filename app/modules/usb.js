const usb = require('usb')

const VENDOR_ID = 0xf347
const PRODUCT_ID = 0x666f

let device

export const getDevice = () => {
  if (device) return device.dev
  else return null
}

export const getDevices = () => {
  return usb.getDeviceList().filter(device => {
    // return true
    const {idVendor, idProduct} = device.deviceDescriptor
    return idVendor === VENDOR_ID && idProduct === PRODUCT_ID
  })
}

export const openDevice = dev => {
  if (device) return false
  if (!dev) return false
  dev.open()
  const interf = dev.interface(1)
  if (!interf) return false
  if (interf.isKernelDriverActive()) interf.detachKernelDriver()
  interf.claim()
  const endpoint = interf.endpoint(0x81)
  if (!endpoint) return false
  device = { dev, interface: interf, endpoint }
  return true
}

export const onData = (cb) => {
  if (!device) return false
  // testing got me to this poll size
  device.endpoint.startPoll(20, 2048)
  device.endpoint.on('data', cb)
  device.endpoint.on('error', closeDevice)
}

export const closeDevice = () => {
  return new Promise((resolve, reject) => {
    if (device) {
      device.interface.release(true, (err) => {
        if (err) reject(err)
        else {
          if (device) device.close()
          resolve()
        }
      })
      device = null
    } else {
      resolve()
    }
  })
}

export const onAttach = (cb) => usb.on('attach', cb)

export const onDetach = (cb) => usb.on('detach', cb)
