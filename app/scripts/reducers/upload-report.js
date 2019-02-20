'use strict'
import types from '../actions/types'

const initialState = {
  report: null
}

export default function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.READ_REPORT_FAIL:
      return { report: null }
    case types.READ_REPORT_SUCCESS:
      return { report: payload.report }
  }
  return state
}
