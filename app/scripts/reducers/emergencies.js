'use strict'
import { get } from 'object-path'
import types from '../actions/types'

const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case (types.GET_EMERGENCIES):
      return { ...state, [action.payload.qs]: { data: [] } }
    case (types.GET_EMERGENCIES_SUCCESS):
      return { ...state, [action.payload.qs]: { data: get(action, 'response.data.results', []) } }
  }
  return state
}

export default reducer
