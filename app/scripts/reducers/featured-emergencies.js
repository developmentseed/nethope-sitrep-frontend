'use strict'
import { get } from 'object-path'
import _without from 'lodash.without'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = []
function reducer (state = initialState, action) {
  if (action.type === types.GET_FEATURED_EMERGENCIES_SUCCESS) {
    const payload = getAsyncResponseData(action, true)
    const next = _without(get(payload, 'featured', []),
      get(payload, 'archived', []))
    return next
  }
  return state
}
export default reducer
