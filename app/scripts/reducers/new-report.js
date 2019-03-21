'use strict'
import types from '../actions/types'
const initialState = {
  value: null
}

function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.CREATE_REPORT_SYNC:
      return { value: payload.value }
    case types.CREATE_REPORT_CLEAR:
      return { value: null }
  }
  return state
}

export default reducer
