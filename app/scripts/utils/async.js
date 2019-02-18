'use strict'
import { get } from 'object-path'
import assert from 'assert'

// Normalize accessing response arrays from API
export function getAsyncResponseData (asyncAction, isSingularPayload) {
  assert(get(asyncAction, 'response.status'), 200)
  const fallback = isSingularPayload ? null : []
  return get(asyncAction, 'response.data', fallback)
}
