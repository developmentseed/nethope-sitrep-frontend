'use strict'
import types from '../actions/types'
import { getAsyncResponseData } from '../utils/async'
import _groupBy from 'lodash.groupby'

const initialState = []

export default function reducer (state = initialState, action) {
  if (action.type === types.GET_REPORTS_SUCCESS) {
    return aggregateReports(getAsyncResponseData(action))
  }
  return state
}

// Aggregates reports according to their `doc_id`.
// Returns array of reports with unique `doc_id` values.
// If input contains reports with duplicate `doc_id` values,
// pick the one with the most recent `created_at` timestamp.
function aggregateReports (reports) {
  const docs = _groupBy(reports, 'doc_id')
  for (let id in docs) {
    docs[id] = docs[id].map(d => ({ ...d, created_at: new Date(d.created_at).getTime() }))
      .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
  }
  const reportList = Object.values(docs).map(docList => docList[0])
    .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
  return reportList
}
