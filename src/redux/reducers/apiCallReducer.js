import * as types from '../actions/actionTypes'
import initialState from './initialState'

const apiCallReducer = (
  state = initialState.apiCallInProgressCounter,
  action
) => {
  if (action.type === types.START_API_CALL) {
    state = state + 1
    return state
  } else if (
    action.type === types.API_CALL_ERROR ||
    action.type.indexOf('_SUCCESS') != -1
  ) {
    state = state - 1
    return state
  }
  return state
}

export default apiCallReducer
