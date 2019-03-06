'use strict'
import { get } from 'object-path'
import types from '../actions/types'

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  idToken: null,
  email: null,
  expiresAt: 0
}

function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.SET_USER_CREDENTIALS:
      return {
        isLoggedIn: true,
        accessToken: payload.accessToken,
        idToken: payload.idToken,
        email: get(payload, 'idTokenPayload.email'),
        expiresAt: payload.expiresAt
      }
    case types.CLEAR_USER_CREDENTIALS:
      return { ...initialState }
  }
  return state
}

export default reducer
