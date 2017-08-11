import { repeat } from './index'

describe('repeat', () => {
  test('should return correct data', () => {
    expect(repeat([1, 2, 3], 3)).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3])
  })
})
