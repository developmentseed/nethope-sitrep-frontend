'use strict'
import types from '../actions/types'

const initialState = {
  loading: false,
  error: null
}

const asyncTypes = [
  types.GET_REPORTS,
  types.GET_REPORT,
  types.PATCH_REPORT,
  types.READ_REPORT,
  types.POST_REPORT
]
const SUCCESS = asyncTypes.map(s => s + '_SUCCESS')
const FAIL = asyncTypes.map(s => s + '_FAIL')

export default function reducer (state = initialState, { type, payload }) {
  if (asyncTypes.indexOf(type) >= 0) {
    return { ...state, loading: true }
  } else if (SUCCESS.indexOf(type) >= 0) {
    return { ...state, loading: false, error: null }
  } else if (FAIL.indexOf(type) >= 0) {
    return { ...state, loading: false, error: payload.error }
  }
  return state
}
