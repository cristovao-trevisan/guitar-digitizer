'strict mode'
const usb = require('usb')
let device = usb.findByIds(0xf347, 0x666f)
device.open()
let deviceInterface = device.interface(1)
if (!deviceInterface) throw new Error('No interface found')
if (deviceInterface.isKernelDriverActive()) {
  deviceInterface.detachKernelDriver()
}
deviceInterface.claim()
let endpoint = deviceInterface.endpoint(0x81)
if (!endpoint) throw new Error('No endpoint found')
endpoint.startPoll(5, 4096 * 4)
let count = 0
console.time('data speed')
endpoint.on('data', buffer => {
  if ((count += buffer.length) > 1000000) {
    endpoint.stopPoll(() => {
      console.timeEnd('data speed')
      console.log(count)
      console.log(buffer.length)

      let buf = []
      for (let i = 0; i < buffer.length; i += 2) buf.push(buffer.readUInt16LE(i))
      let hexBuff = buf.map(x => x.toString(16))
      let index = buf.indexOf(0xabcd)
      console.log(hexBuff[index])
      console.log(hexBuff[index + 1])
      index = buf.indexOf(0xabcd, index + 2)
      console.log(hexBuff[index])
      console.log(hexBuff[index + 1])
      deviceInterface.release(() => {})
    })
  }
})

let buffer = Buffer.alloc(2048, Buffer.from([0xab, 0xcd]))
console.time('readUInt16LE')
let buf = []
for (let i = 0; i < buffer.length; i += 2) buf.push(buffer.readUInt16LE(i))
console.timeEnd('readUInt16LE')
