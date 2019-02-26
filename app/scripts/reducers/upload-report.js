'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = {
  nextReport: null,
  nextReportID: null
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case types.READ_REPORT_FAIL:
      return { ...state, nextReport: null }
    case types.READ_REPORT_SUCCESS:
      return { ...state, nextReport: action.payload.report }
    case types.POST_REPORT_SUCCESS:
      return { ...state, nextReportID: getAsyncResponseData(action).id }
    case types.CLEAR_UPLOAD_REPORT_STATE:
      return { nextReport: null, nextReportID: null }
  }
  return state
}
