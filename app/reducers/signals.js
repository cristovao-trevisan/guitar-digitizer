import { SET_SIGNALS, CLEAR_SIGNALS } from '../constants/action-types'

export default (signals = {}, action) => {
  switch (action.type) {
    case SET_SIGNALS: {
      return Object.assign({}, signals, action.signals)
    }
    case CLEAR_SIGNALS: {
      return {}
    }
    default:
      return signals
  }
}
