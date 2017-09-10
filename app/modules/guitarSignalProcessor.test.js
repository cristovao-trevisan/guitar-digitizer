import { interpreter, windowBuffer, guitarWindowBuffer, processor } from './guitarSignalProcessor'
import { repeat } from '../helpers'
import { Sinewave } from 'wave-generator'
const { MacLeod } = require('node-pitchfinder')

describe('interpreter', () => {
  const header = index => [0xcd, 0xab, index & 0xff, 0xef]
  const calcValue = value => (value & 0xfff) - (0x0fff / 2)
  const data = [1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0]

  test('should interpret correct data', () => {
    const times = 2048
    const interpret = interpreter()
    const d = Buffer.from(header(0).concat(repeat(data, times)))
    expect(interpret(d)).toEqual(Array(6).fill(0).map(
      (el, i) => repeat(calcValue(i + 1), times)
    ))
  })

  test('should throw error for wrong header', () => {
    const interpret = interpreter()
    const d = Buffer.from([0xcd, 0xab, 0x00, 0xee]) // 0xee should be 0xef
    expect(() => interpret(d)).toThrowError('Error on header second short')
  })

  test('should throw error for missing counter', () => {
    const times = 10
    const interpret = interpreter()
    const d1 = Buffer.from(header(12).concat(repeat(data, times)))
    const d2 = Buffer.from(header(14).concat(repeat(data, times)))
    expect(() => interpret(d1)).not.toThrow()
    expect(() => interpret(d2)).toThrowError('Lost index. Expected: 13, but got: 14')
  })

  test('should throw error for missing data', () => {
    const times = 10
    const interpret = interpreter()
    let d = header(0).concat(repeat(data, times))
    d = Buffer.from(d.slice(0, d.length - 4).concat(header(1)))
    expect(() => interpret(d)).toThrowError('Missing input count: 4')
  })

  test('should start working again after a fail', () => {
    const times = 100
    const interpret = interpreter()
    const d1 = Buffer.from(data.slice(2).concat(header(0)).concat(data))
    const d2 = Buffer.from(header(1).concat(repeat(data, times)))
    const d3 = Buffer.from(header(2).concat(repeat(data, times)))
    expect(() => interpret(d1)).toThrowError('Missing input count')
    expect(interpret(d2)).toEqual(Array(6).fill(0).map(
      (el, i) => repeat(calcValue(i + 1), times)
    ))
    expect(() => interpret(d1)).toThrowError()
    expect(interpret(d3)).toEqual(Array(6).fill(0).map(
      (el, i) => repeat(calcValue(i + 1), times)
    ))
  })
})

describe('windowBuffer', () => {
  test('should buffer until full and keep windowSize - windowDelta', () => {
    const windowSize = 2048
    const windowDelta = 512
    const buffer = windowBuffer(windowSize, windowDelta)

    const input1 = repeat(1, windowSize - 100)
    const input2 = repeat(2, 100)
    const input3 = repeat(3, windowDelta - 10)
    const input4 = repeat(4, 10)

    expect(buffer(input1)).toBeNull()
    expect(buffer(input2).length).toEqual(windowSize)
    expect(buffer(input3)).toBeNull()
    expect(buffer(input4).length).toEqual(windowSize)
  })

  test('should throw error if full', () => {
    const windowSize = 100
    const windowDelta = 10
    const maxBufferSize = 150
    const buffer = windowBuffer(windowSize, windowDelta, maxBufferSize)

    const input1 = repeat(1, windowSize)
    const input2 = repeat(2, maxBufferSize - windowSize + windowDelta)
    const input3 = repeat(3, windowDelta + 1)

    expect(buffer(input1).length).toBe(windowSize)
    expect(buffer(input2).length).toBe(windowSize)
    expect(() => buffer(input3)).toThrowError('Buffer overflow')
  })
})

describe('guitarWindowBuffer', () => {
  test('it\'s just 6 window buffers', () => {
    const data = repeat(1, 2048)
    const input = [data, data, data, data, data, data]
    const buffer = guitarWindowBuffer(2048)
    expect(buffer(input).length).toBe(6)
  })
})

describe('processor', () => {
  const fs = 44100
  const size = 2048
  const detector = MacLeod({ bufferSize: 2048, sampleRate: fs, cutoff: 0.85, probabilityThreshold: 0.7 })

  test('should detect correct note', () => {
    const A440 = Sinewave(size, 440, fs, 500)(size)
    let called = false
    const onNoteOn = () => { called = true }
    const process = processor(onNoteOn, () => {}, () => detector)
    process(Array(6).fill(0).map(() => A440))
    expect(called).toBe(true)
  })

  test('should not detect small amplitude note', () => {
    const A440 = Sinewave(size, 440, fs, 200)(size)
    let called = false
    const onNoteOn = () => { called = true }
    const process = processor(onNoteOn, () => {}, () => detector)
    process(Array(6).fill(0).map(() => A440))
    expect(called).toBe(false)
  })
})
