const freq = require('tonal-freq')

let note
console.time('tonal')
for (let i = 0; i < 10000; i++) note = freq.toMidi(111)
console.timeEnd('tonal')
console.log(note)
