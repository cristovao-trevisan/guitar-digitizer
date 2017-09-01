import { interpreter } from './guitarSignalProcessor'
import { repeat } from '../helpers'

const header = index => [0xcd, 0xab, index & 0xff, 0xef]
const calcValue = value => (value & 0xfff) - (0x0fff / 2)
const data = [1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0]

test('should interpret correct data', () => {
  const times = 10
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
