const usb = require('usb')

const VENDOR_ID = 0xf347
const PRODUCT_ID = 0x666f

const device = usb.findByIds(VENDOR_ID, PRODUCT_ID)

if (device) {
  device.open()
  const interf = device.interface(1)
  if (interf.isKernelDriverActive()) interf.detachKernelDriver()
  interf.claim()
  const endpoint = interf.endpoint(0x81)
  endpoint.startPoll(3, 2048)
  let counter = 0
  let maxDataSize = 0
  endpoint.on('data', data => {
    if (counter === 0) console.time('data speed')
    counter += data.length
    maxDataSize = Math.max(data.length, maxDataSize)
    if (counter > 48000 * 6 * 2 * 3) {
      console.timeEnd('data speed')
      console.log(maxDataSize)
      process.exit(0)
    }
  })

  endpoint.on('error', err => {
    console.error(err)
    device.close()
  })
}
