'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_REPORT_SUCCESS:
    case types.PATCH_REPORT_SUCCESS:
    case types.POST_REPORT_SUCCESS:
      return { ...state, [action.payload.id]: setDefaultProps(getAsyncResponseData(action, true)) }
  }
  return state
}
export default reducer

function setDefaultProps (report) {
  // Notebookjs will throw an exception if this is not set.
  // https://github.com/jsvine/notebookjs/issues/21
  if (!report.content.hasOwnProperty('metadata')) {
    report.content.metadata = {}
  }
  return report
}
