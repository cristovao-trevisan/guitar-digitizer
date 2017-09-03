const { Sinewave } = require('wave-generator')
const { MacLeod, YIN, AMDF } = require('node-pitchfinder')

const length = 1024
const fs = 47000
const macLeod = MacLeod({ bufferSize: length, sampleRate: fs, cutoff: 0.6 })
const yin = YIN({ bufferSize: length, sampleRate: fs, threshold: 0.3 })
const amdf = AMDF({ sensitivity: 0.15, ratio: 10 })

const sumArrays = (arr1, arr2) => {
  const result = []
  arr1.forEach((value, i) => result.push(value + arr2[i]))
  return result
}

const mixedSignal = sumArrays(
  Sinewave(length, 220, fs, 100)(length),
  Sinewave(length, 1000, fs, 30)(length)
)

let result = macLeod.getResult(mixedSignal)
console.log(result.pitch, result.probability)

result = yin.getResult(mixedSignal)
console.log(result.pitch, result.probability)

const pitch = amdf(mixedSignal)
console.log(pitch)
