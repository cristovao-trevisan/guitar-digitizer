import { frequencyDetector, frequencyDetectorSync } from './frequencyDetector'
import { Sinewave } from 'react-plotter/dist/helpers/waveGenerators'
import { sampleFrequency } from '../constants/guitar'

const A440 = Sinewave(2048, 440, sampleFrequency, 100)(2048)

describe('assync', () => {
  test('should resolve correct frequency', done => {
    const calcFrequency = frequencyDetector(sampleFrequency, 2048)
    calcFrequency(A440).then(pitch => {
      expect(pitch).toBeCloseTo(440)
      done()
    }).catch(done.fail)
  })
})

describe('sync', () => {
  test('should resolve correct frequency', () => {
    const calcFrequencySync = frequencyDetectorSync(sampleFrequency, 2048)
    expect(calcFrequencySync(A440)).toBeCloseTo(440)
  })
})
