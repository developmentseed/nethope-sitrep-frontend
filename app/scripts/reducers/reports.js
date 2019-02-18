'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = []

export default function reducer (state = initialState, action) {
  if (action.type === types.GET_REPORTS_SUCCESS) {
    return getAsyncResponseData(action)
  }
  return state
}
