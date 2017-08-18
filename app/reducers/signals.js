import { SET_SIGNALS } from '../constants/action-types'

export default (signals = [], action) => {
  switch (action.type) {
    case SET_SIGNALS: {
      return action.signals
    }
    default:
      return signals
  }
}
