import { calculateAverageAmplitude } from './calculator'
import { Squarewave } from 'wave-generator'

const square440 = Squarewave(1000, 100, 1000, 100)(1000)

describe('calculateAverageAmplitude', () => {
  test('should calculate correct value', () => {
    const amplitude = calculateAverageAmplitude(square440)

    expect(square440.length).toBe(1000)
    expect(amplitude).toBe(100)
  })

  test('should remove DC component', () => {
    const squareWithDC = square440.map(x => x + 50)
    let amplitude = calculateAverageAmplitude(squareWithDC)

    expect(amplitude).toBe(100)

    amplitude = calculateAverageAmplitude([100, 100, 100, 100, 100])
    expect(amplitude).toBe(0)
  })
})
