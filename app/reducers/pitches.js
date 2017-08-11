import { SET_PITCH, CLEAR_PITCHES } from '../constants/action-types'

export default (signals = {}, action) => {
  switch (action.type) {
    case SET_PITCH: {
      return Object.assign({}, signals, action.pitch)
    }
    case CLEAR_PITCHES: {
      return {}
    }
    default:
      return signals
  }
}
