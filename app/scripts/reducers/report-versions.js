'use strict'
import _keyBy from 'lodash.keyby'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_REPORT_VERSIONS_SUCCESS:
      let versions = getAsyncResponseData(action).map(version => ({
        ...version,
        created_at: new Date(version.created_at).getTime()
      }))
      let next = _keyBy(versions, 'id')
      return { ...state, ...next }
  }
  return state
}

export default reducer
