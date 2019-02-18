'use strict'
import { get } from 'object-path'
import assert from 'assert'

// Normalize accessing response arrays from API
export function getAsyncResponseData (asyncAction) {
  assert(get(asyncAction, 'response.status'), 200)
  return get(asyncAction, 'response.data', [])
}
