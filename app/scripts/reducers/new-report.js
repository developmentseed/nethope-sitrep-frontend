'use strict'
import types from '../actions/types'
const initialState = {
  value: null,
  tags: [],
  country: null,
  emergency: null
}

function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.CREATE_REPORT_SYNC:
      return { ...state, value: payload.value }
    case types.CREATE_REPORT_CLEAR:
      return { ...state, value: null }
  }
  return state
}

export default reducer
