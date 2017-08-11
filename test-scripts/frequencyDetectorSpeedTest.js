import { frequencyDetector, frequencyDetectorSync } from '../app/modules/frequencyDetector'
import { Sinewave } from 'react-plotter/dist/helpers/waveGenerators'
import { sampleFrequency } from '../app/constants/guitar'

const samples = 2048
const times = 1000
const A440 = Sinewave(samples, 440, sampleFrequency, 100)(samples)

console.log('Sync start')
const calcFrequencySync = frequencyDetectorSync(sampleFrequency, samples)

let initialTime = Date.now()
for (let i = 0; i < times; i++) calcFrequencySync(A440)
let endTime = Date.now()

console.log('Sync end:', (endTime - initialTime) / times, 'ms')

console.log('Assync start')
const calcFrequency = frequencyDetector(sampleFrequency, 2048)
let counter = 0
initialTime = Date.now()
for (let i = 0; i < times; i++) {
  calcFrequency(A440).then(pitch => {
    if (++counter === times) {
      let endTime = Date.now()
      console.log('Assync end:', (endTime - initialTime) / times, 'ms')
    }
  }).catch(console.error)
}
