import reducer from './signalsData'
import { SET_SIGNALS_DATA, CLEAR_SIGNALS } from '../constants/action-types'

test('default value', () => {
  expect(reducer(undefined, {})).toEqual({})
})

test('should add correctly', () => {
  let state = reducer(undefined, {
    type: SET_SIGNALS_DATA,
    signals: [{a: 1}, {b: 2}]
  })
  expect(state).toEqual({a: 1, b: 2})

  state = reducer(state, {
    type: SET_SIGNALS_DATA,
    signals: [{b: 3}]
  })
  expect(state).toEqual({a: 1, b: 3})
})

test('should remove correctly', () => {
  expect(reducer({a: 1, b: 2}, {
    type: CLEAR_SIGNALS
  })).toEqual({})
})
