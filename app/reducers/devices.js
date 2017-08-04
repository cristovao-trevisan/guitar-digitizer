import { ADD_DEVICE, REMOVE_DEVICE } from '../constants/action-types'

export default (state = [], action) => {
  switch (action.type) {
    case ADD_DEVICE: return state.concat(action.device || action.devices)
    case REMOVE_DEVICE: {
      let index = state.indexOf(action.device)
      if (index < 0) return state
      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]
    }
    default:
      return state
  }
}
