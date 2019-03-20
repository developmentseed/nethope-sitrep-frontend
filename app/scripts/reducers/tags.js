'use strict'
import { getAsyncResponseData } from '../utils/async'
import types from '../actions/types'

const initialState = { themes: null }
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_TAGS:
      return { themes: [] }
    case types.GET_TAGS_SUCCESS:
      return { themes: getAsyncResponseData(action).map(d => ({ label: d.name, value: d.id })) }
  }
  return state
}

export default reducer
