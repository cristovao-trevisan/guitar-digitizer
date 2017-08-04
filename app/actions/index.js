import * as types from '../constants/action-types'

export const addDevice = (device) => ({
  type: types.ADD_DEVICE,
  device
})

export const removeDevice = (device) => ({
  type: types.REMOVE_DEVICE,
  device
})
