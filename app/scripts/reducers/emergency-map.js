'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'
const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_EMERGENCY:
      return { ...state, [action.payload.emergencyID]: {} }
    case types.GET_EMERGENCY_SUCCESS:
    case types.GET_STATIC_EMERGENCY_ASSETS_SUCCESS:
      return { ...state, [action.payload.emergencyID]: Object.assign({}, state[action.payload.emergencyID], getAsyncResponseData(action), true) }
  }
  return state
}

export default reducer
