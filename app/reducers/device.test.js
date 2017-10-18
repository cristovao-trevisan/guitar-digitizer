import reducer from './device'
import { SET_DEVICE, REMOVE_DEVICE } from '../constants/action-types'

test('default value', () => {
  expect(reducer(undefined, {})).toEqual(null)
})

test('should set correctly', () => {
  let state = reducer({}, {
    type: SET_DEVICE,
    device: 'test 1'
  })
  expect(state).toEqual('test 1')

  state = reducer(state, {
    type: SET_DEVICE,
    device: 'test 2'
  })
  expect(state).toEqual('test 2')
})

test('should remove correctly', () => {
  expect(reducer('my device', {
    type: REMOVE_DEVICE,
    device: 'not equal'
  })).toBe('my device')
  expect(reducer('my device', {
    type: REMOVE_DEVICE,
    device: 'my device'
  })).toBe(null)
})
