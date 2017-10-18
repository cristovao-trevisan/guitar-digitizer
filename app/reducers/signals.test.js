import reducer from './signals'
import { SET_SIGNALS, CLEAR_SIGNALS } from '../constants/action-types'

test('default value', () => {
  expect(reducer(undefined, {})).toEqual([])
})

test('should add correctly', () => {
  let state = reducer(undefined, {
    type: SET_SIGNALS,
    signals: ['test 1']
  })
  expect(state).toEqual(['test 1'])

  state = reducer(state, {
    type: SET_SIGNALS,
    signals: ['test 2']
  })
  expect(state).toEqual(['test 2'])
})

test('should remove correctly', () => {
  expect(reducer(['test 1', 'test 2', 'test 3'], {
    type: CLEAR_SIGNALS
  })).toEqual([])
})
