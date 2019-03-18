'use strict'
import { get } from 'object-path'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'

const initialState = {}
function reducer (state = initialState, action) {
  switch (action.type) {
    case types.GET_COUNTRIES_SUCCESS:
      return { ...state, ...zipCountries(action, state) }
    case types.GET_STATIC_COUNTRY_ASSETS_SUCCESS:
      let { countryID } = action.payload
      return { ...state, [countryID]: { ...state[countryID], ...getAsyncResponseData(action) } }
  }
  return state
}

function zipCountries (action, state) {
  const next = {}
  get(action, 'response.data.results', []).forEach(c => {
    next[c.id] = Object.assign({}, state[c.id] || {}, {
      id: c.id,
      iso: c.iso,
      name: c.name,
      region: c.region
    })
  })
  return next
}

export default reducer
