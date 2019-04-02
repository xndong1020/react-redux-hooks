import * as types from './actionTypes'

export const startApiCall = () => {
  return { type: types.START_API_CALL }
}

export const apiCallError = err => {
  return { type: types.API_CALL_ERROR, err }
}
