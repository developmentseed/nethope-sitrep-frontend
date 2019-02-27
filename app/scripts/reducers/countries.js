'use strict'
import { get } from 'object-path'
import types from '../actions/types'

const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_COUNTRIES_SUCCESS:
      return { ...state, ...zipCountries(action) }
  }
  return state
}

function zipCountries (action) {
  const next = {}
  get(action, 'response.data.results', []).forEach(c => {
    next[c.id] = {
      id: c.id,
      iso: c.iso,
      name: c.name,
      region: c.region
    }
  })
  return next
}

export default reducer
