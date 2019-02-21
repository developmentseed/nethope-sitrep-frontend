'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_REPORT_SUCCESS:
    case types.PATCH_REPORT_SUCCESS:
    case types.POST_REPORT_SUCCESS:
      return { ...state, [action.payload.id]: getAsyncResponseData(action, true) }
  }
  return state
}
export default reducer
