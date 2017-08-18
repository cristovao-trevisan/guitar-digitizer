import object from './object'
const SET = 0
const REMOVE = 1
const CLEAR = 2
const reducer = object(SET, CLEAR, REMOVE)

test('default value', () => {
  expect(reducer(undefined, {})).toEqual({})
})

test('should set correctly', () => {
  let state = reducer({}, {
    type: SET,
    props: {1: 1}
  })
  expect(state).toEqual({1: 1})

  state = reducer(state, {
    type: SET,
    props: {1: 2, 2: 2}
  })
  expect(state).toEqual({1: 2, 2: 2})
})

test('should remove correctly', () => {
  expect(reducer({1: 1, 2: 2, 3: 3}, {
    type: REMOVE,
    props: [1, 3]
  })).toEqual({2: 2})
})

test('should clear correctly', () => {
  expect(reducer(
    {1: 1, 2: 2, 3: 3},
    {type: CLEAR})
  ).toEqual({})
})
