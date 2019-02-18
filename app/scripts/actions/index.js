'use strict'
import url from 'url'
import { asyncActionCreator } from 'redux-action-creator'
import axios from 'axios'
import types from './types'
import { api } from '../config'

// Note, For "detail" queries, ie a single report, we include
// a special header so the API returns the data as an object,
// and throws an error code if it's not found.
// Otherwise, it would return an empty array.
// http://postgrest.org/en/v5.2/api.html#singular-or-plural

export const getReports = asyncActionCreator(
  types.GET_REPORTS,
  () => axios.get(url.resolve(api, 'reports'))
)

export const getReport = asyncActionCreator(
  types.GET_REPORT, 'id',
  ({ id }) => axios.get(url.resolve(api, `reports?id=eq.${id}`), {
    headers: { Accept: 'application/vnd.pgrst.object+json' }
  })
)
