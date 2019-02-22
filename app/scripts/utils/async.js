'use strict'
import { get } from 'object-path'
import assert from 'assert'

// Normalize accessing response arrays from API
export const getAsyncResponseData = (asyncAction, isSingularPayload) => {
  assert(get(asyncAction, 'response.status'), 200)
  const fallback = isSingularPayload ? null : []
  return get(asyncAction, 'response.data', fallback)
}

export const getForkPayloadFromReport = (report) => {
  const payload = Object.assign({}, report)
  payload['forked_from'] = report.id
  const without = ['id', 'doc_id', 'created_at']
  without.forEach(key => {
    delete payload[key]
  })
  return payload
}
