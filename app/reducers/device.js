import { SET_DEVICE, REMOVE_DEVICE } from '../constants/action-types'

export default (device = null, action) => {
  switch (action.type) {
    case SET_DEVICE: return action.device
    case REMOVE_DEVICE: {
      if (action.device === device) return null
      else return device
    }
    default:
      return device
  }
}
