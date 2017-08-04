let buffer = Buffer.alloc(2048, Buffer.from([0xab, 0xcd]))
console.time('readUInt16LE')
let buf = []
for (let i = 0; i < buffer.length; i += 2) buf.push(buffer.readUInt16LE(i))
console.timeEnd('readUInt16LE')

console.time('readUInt16LE no assert')
buf = []
for (let i = 0; i < buffer.length; i += 2) buf.push(buffer.readUInt16LE(i, true))
console.timeEnd('readUInt16LE no assert')
