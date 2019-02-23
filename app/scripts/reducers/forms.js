'use strict'
import types from '../actions/types'

const initialState = {}
function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.CREATE_FORM:
      return { ...state, [payload.formID]: payload.initialValue }
    case types.UPDATE_FORM:
      return { ...state, [payload.formID]: payload.value }
    case types.DESTROY_FORM:
      return { ...state, [payload.formID]: null }
  }
  return state
}

export default reducer
