'use strict'
import types from '../actions/types'

const initialState = {
  type: null,
  loading: 0,
  error: null
}

const asyncTypes = [
  types.GET_REPORTS,
  types.GET_REPORT,
  types.GET_REPORT_VERSIONS,
  types.PATCH_REPORT,
  types.READ_REPORT,
  types.POST_REPORT,
  types.GET_COUNTRIES,
  types.GET_EMERGENCIES
]
const SUCCESS = asyncTypes.map(s => s + '_SUCCESS')
const FAIL = asyncTypes.map(s => s + '_FAIL')

export default function reducer (state = initialState, { type, payload, error }) {
  if (asyncTypes.indexOf(type) >= 0) {
    return { ...state, type, loading: state.loading + 1 }
  } else if (SUCCESS.indexOf(type) >= 0) {
    return { ...state, type, loading: state.loading - 1, error: null }
  } else if (FAIL.indexOf(type) >= 0) {
    return { ...state, type, loading: state.loading - 1, error: error }
  }
  return state
}
