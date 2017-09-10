import { windowBuffer, guitarWindowBuffer } from '../app/modules/guitarSignalProcessor'

const data1 = Array(512).fill(0)
const data2 = [data1, data1, data1, data1, data1, data1]

let buffer = windowBuffer(2048, 512)
console.time('single buffering')
for (let i = 0; i < 10000; i++) {
  var output = buffer(data1)
}
console.timeEnd('single buffering')
console.log(output.length)

buffer = guitarWindowBuffer(2048, 512)
console.time('multiple buffering')
for (let i = 0; i < 10000; i++) {
  output = buffer(data2)
}
console.timeEnd('multiple buffering')
console.log(output.length)
console.log(output[0].length)
