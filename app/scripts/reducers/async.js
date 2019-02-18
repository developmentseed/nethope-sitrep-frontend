'use strict'
import types from '../actions/types'

const initialState = {
  loading: false,
  error: null
}

const asyncTypes = ['GET_REPORTS']
const SUCCESS = asyncTypes.map(s => s += '_SUCCESS')
const FAIL = asyncTypes.map(s => s += '_FAIL')

export default function reducer (state = initialState, action) {
  if (asyncTypes.indexOf(action.type) >= 0) {
    return { ...state, loading: true }
  } else if (SUCCESS.indexOf(action.type) >= 0) {
    return { ...state, loading: false, error: null }
  } else if (FAIL.indexOf(action.type) >= 0) {
    return { ...state, loading: false, error: action.error }
  }
  return state
}
