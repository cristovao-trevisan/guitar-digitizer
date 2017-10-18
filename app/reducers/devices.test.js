import reducer from './devices'
import { ADD_DEVICE, REMOVE_DEVICE } from '../constants/action-types'

test('default value', () => {
  expect(reducer(undefined, {})).toEqual([])
})

test('should add correctly', () => {
  let state = reducer(undefined, {
    type: ADD_DEVICE,
    device: 'test 1'
  })
  expect(state).toEqual(['test 1'])

  state = reducer(state, {
    type: ADD_DEVICE,
    device: 'test 2'
  })
  expect(state).toEqual(['test 1', 'test 2'])
})

test('should remove correctly', () => {
  let state = reducer(['test 1', 'test 2', 'test 3'], {
    type: REMOVE_DEVICE,
    device: 'test 2'
  })
  expect(state).toEqual(['test 1', 'test 3'])

  state = reducer(state, {
    type: REMOVE_DEVICE,
    device: 'does not exists'
  })
  expect(state).toEqual(['test 1', 'test 3'])
})
