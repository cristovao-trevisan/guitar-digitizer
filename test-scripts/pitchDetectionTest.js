const { Sinewave } = require('wave-generator')
const { MacLeod, YIN } = require('node-pitchfinder')

const length = 2048
const fs = 47000
const macLeod = MacLeod({ bufferSize: length, sampleRate: fs, cutoff: 0.6 })
const yin = YIN({ bufferSize: length, sampleRate: fs, threshold: 0.3 })

const sumArrays = (arr1, arr2) => {
  const result = []
  arr1.forEach((value, i) => result.push(value + arr2[i]))
  return result
}

const mixedSignal = sumArrays(
  Sinewave(length, 220, fs, 100)(length),
  Sinewave(length, 1000, fs, 30)(length)
)

console.time('MacLeod')
for (let i = 0; i < 1000; i++) {
  var result = macLeod.getResult(mixedSignal)
}
console.timeEnd('MacLeod')
console.log(result.pitch, result.probability)

console.time('YIN')
for (let i = 0; i < 1000; i++) {
  result = yin.getResult(mixedSignal)
}
console.timeEnd('YIN')
console.log(result.pitch, result.probability)
