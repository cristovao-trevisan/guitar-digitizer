import { Sinewave } from 'wave-generator'
import { sampleFrequency as sampleRate } from '../constants/guitar'
import { YIN, MacLeod } from 'node-pitchfinder'

const A440 = Sinewave(2048, 440, sampleRate, 100)(2048)

describe('YIN', () => {
  const detector = new YIN({ sampleRate })
  test('should resolve correct frequency', () => {
    expect(detector(A440)).toBeCloseTo(440, 1)
  })
})

describe('MacLeod', () => {
  const detector = new MacLeod({ bufferSize: 2048, sampleRate })
  test('should resolve correct frequency', () => {
    expect(detector(A440)).toBeCloseTo(440, 2)
  })
})
