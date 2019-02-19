'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = {}
function reducer (state = initialState, action) {
  if (action.type === types.GET_REPORT_SUCCESS) {
    state = { ...state, [action.payload.id]: getAsyncResponseData(action, true) }
  } else if (action.type === types.PATCH_REPORT_SUCCESS) {
    state = { ...state, [action.payload.id]: getAsyncResponseData(action, true) }
  }
  return state
}
export default reducer
